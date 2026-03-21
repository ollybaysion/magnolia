# 검증 시스템 개선 계획

## 핵심 문제
- 현재 테스트 데이터가 최대 6~10개 수준으로 성능 검증 불가
- 데이터가 C++ 소스 코드에 배열 리터럴로 하드코딩됨 → 1억개는 불가능 (~500MB 소스)
- Edge case 부족 (음수, 전부 동일값, 빈 배열 등 미테스트)

## 변경 대상 파일
- `public/algorithms.js` — 스켈레톤, 솔루션, 테스트 케이스 전부
- `server.js` — `/api/verify` 응답 처리, 타임아웃 분기
- `public/app.js` — 결과 모달에 시간/크기 표시
- `public/style.css` — 성능 배지 스타일

---

## Phase 1: MAXN 패턴 마이그레이션

모든 알고리즘의 `const int MAXN = N;`을 아래로 변경:
```cpp
#ifndef MAXN
#define MAXN 100001
#endif
```
이렇게 하면 성능 하네스에서 `#define MAXN 100000001`로 오버라이드 가능.

skeleton, solution 모두 일괄 변경. (기존 correctness 하네스는 그대로 동작)

## Phase 2: 테스트 케이스 스키마 확장

기존 `{ name, harness, expected }` → 아래 필드 추가 (optional, 하위호환):
```js
{
  name: string,
  harness: string,
  expected: string,
  tier: "correctness" | "performance",  // 없으면 "correctness"
  size: number,                          // 데이터 크기 (표시용)
  timeout: number                        // ms 단위 타임아웃
}
```

## Phase 3: 성능 테스트 하네스 설계

성능 테스트는 하네스 내부에서 **데이터 생성 + 실행 + 정답 검증 + 시간 측정** 모두 수행:

```cpp
#include <cstdio>
#include <ctime>
#define MAXN 1000001
%USER_CODE%

unsigned int _rng = 42;
unsigned int _lcg() { _rng = _rng * 1664525u + 1013904223u; return _rng; }

int main() {
    n = 1000000;
    for (int i = 0; i < n; i++) arr[i] = (int)(_lcg() % 1000000000);

    clock_t t0 = clock();
    mergeSort(0, n - 1);
    clock_t t1 = clock();

    // 정렬 검증
    bool ok = true;
    for (int i = 1; i < n; i++) if (arr[i] < arr[i-1]) { ok = false; break; }

    double ms = (double)(t1 - t0) / CLOCKS_PER_SEC * 1000.0;
    if (ok) printf("PASS %.1f\n", ms);
    else printf("FAIL not_sorted\n");
    return 0;
}
```

**출력 프로토콜:** `PASS <ms>` 또는 `FAIL <reason>` — 서버가 파싱.

**데이터 크기 티어:**

| 티어 | n | 타임아웃 | 목적 |
|------|---|----------|------|
| 정확성 | 1~10 | 5초 | Edge case, 정확성 |
| 중간 | 10,000 | 5초 | 기본 성능 |
| 대형 | 1,000,000 | 10초 | 복잡도 검증 |
| 스트레스 | 100,000,000 | 60초 | 풀스케일 |

> 100M 배열: `int arr[100000001] + tmp[100000001]` = ~800MB. 메모리 부족 환경에선 10M까지만 실행하는 분기 추가 고려.

## Phase 4: 서버 변경 (`server.js`)

`/api/verify`에서:
1. `tc.tier === "performance"` (또는 `expected === "__PERF__"`) 감지
2. `tc.timeout`을 `runCpp()`에 전달 (기본 5초 유지)
3. stdout에서 `PASS <ms>` / `FAIL <reason>` 파싱
4. 응답에 `timeMs`, `tier`, `size` 필드 추가

```js
if (tc.tier === 'performance') {
    const stdout = result.stdout.trim();
    if (stdout.startsWith('PASS')) {
        testResults.push({
            name: tc.name, passed: true,
            tier: 'performance', size: tc.size,
            timeMs: parseFloat(stdout.split(' ')[1])
        });
    } else {
        testResults.push({
            name: tc.name, passed: false,
            tier: 'performance', size: tc.size,
            error: stdout.replace('FAIL ', '')
        });
    }
}
```

## Phase 5: 프론트엔드 변경 (`app.js` + `style.css`)

`renderVerifyResult()`에 성능 테스트 결과 표시:
- 데이터 크기 배지: `n=1M`, `n=100M`
- 실행 시간 배지: `2340ms` (초록 <1s, 노랑 <5s, 빨강 ≥5s)
- 정확성/성능 테스트를 시각적으로 구분

## Phase 6: Edge Case 추가 (알고리즘 카테고리별)

**Sorting (merge, quick, counting):**
- 모두 동일한 값
- 두 종류 값만 존재 (0, 1 반복)
- 음수 포함
- 빈 배열 (n=0, 가능한 경우)

**Data Structure (heap, PQ, fenwick, segment tree, deque, hash_map, trie):**
- 빈 상태에서 연산
- 단일 원소
- 중복 키/값
- insert/remove 교차 반복

**Graph (dijkstra, BFS, kruskal, topo_sort, SCC, LCA, network_flow):**
- 단일 노드
- 완전 그래프 (dense)
- 선형 체인
- 가중치 0인 간선 (dijkstra)
- 자기 루프

**Geometry (convex_hull):**
- 일직선 위의 점들 (collinear)
- 모두 동일한 점
- 2개 점만

**Optimization (knuth, 2-opt, or-opt):**
- 최소 입력 크기
- 이미 최적인 배치

---

## 구현 순서 요약
1. MAXN 패턴 일괄 변경 (skeleton + solution)
2. 서버에 성능 테스트 파싱 로직 추가
3. 프론트엔드 시간/크기 표시 추가
4. 각 알고리즘에 edge case 추가
5. 각 알고리즘에 성능 티어 테스트 추가 (sorting부터 시작)
