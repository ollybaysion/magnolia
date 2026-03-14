const ALGORITHMS = [
  {
    id: 'merge_sort',
    name: 'Merge Sort',
    category: 'Sorting',
    difficulty: 1,
    description: '분할 정복 기반 안정 정렬. O(n log n)',
    skeleton: `// Merge Sort (No STL)
// 배열 arr[0..n-1]을 오름차순 정렬하시오.
// 임시 배열 tmp[]를 사용할 수 있습니다.

const int MAXN = 100001;
int arr[MAXN], tmp[MAXN];
int n;

void merge(int left, int mid, int right) {
    // TODO: 구현
}

void mergeSort(int left, int right) {
    // TODO: 구현
}`,
    solution: `const int MAXN = 100001;
int arr[MAXN], tmp[MAXN];
int n;

void merge(int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) tmp[k++] = arr[i++];
        else tmp[k++] = arr[j++];
    }
    while (i <= mid) tmp[k++] = arr[i++];
    while (j <= right) tmp[k++] = arr[j++];
    for (int t = left; t <= right; t++) arr[t] = tmp[t];
}

void mergeSort(int left, int right) {
    if (left >= right) return;
    int mid = (left + right) / 2;
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
}`,
    keywords: ['divide and conquer', 'stable sort', 'O(n log n)'],
    testCases: [
      {
        name: "기본 정렬",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 5;\n    int input[] = {5, 3, 1, 4, 2};\n    for (int i = 0; i < n; i++) arr[i] = input[i];\n    mergeSort(0, n - 1);\n    for (int i = 0; i < n; i++) { if (i) printf(" "); printf("%d", arr[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "1 2 3 4 5\n"
      },
      {
        name: "이미 정렬됨",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 4;\n    int input[] = {1, 2, 3, 4};\n    for (int i = 0; i < n; i++) arr[i] = input[i];\n    mergeSort(0, n - 1);\n    for (int i = 0; i < n; i++) { if (i) printf(" "); printf("%d", arr[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "1 2 3 4\n"
      },
      {
        name: "역순 + 중복",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 6;\n    int input[] = {5, 5, 3, 3, 1, 1};\n    for (int i = 0; i < n; i++) arr[i] = input[i];\n    mergeSort(0, n - 1);\n    for (int i = 0; i < n; i++) { if (i) printf(" "); printf("%d", arr[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "1 1 3 3 5 5\n"
      },
      {
        name: "단일 원소",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 1;\n    arr[0] = 42;\n    mergeSort(0, 0);\n    printf("%d\\n", arr[0]);\n    return 0;\n}`,
        expected: "42\n"
      }
    ]
  },
  {
    id: 'counting_sort',
    name: 'Counting Sort',
    category: 'Sorting',
    difficulty: 1,
    description: '비교 기반이 아닌 정렬. 값의 범위가 제한적일 때 O(n + k)로 안정 정렬 가능.',
    skeleton: `// Counting Sort (No STL)
// 배열 arr[0..n-1]을 오름차순 정렬하시오.
// 값의 범위: 0 <= arr[i] < MAXVAL

const int MAXN = 100001;
const int MAXVAL = 10001;

int arr[MAXN], sorted[MAXN];
int cnt[MAXVAL];
int n;

void countingSort() {
    // TODO: 구현
    // 1) cnt 배열 초기화
    // 2) 각 값의 등장 횟수 카운트
    // 3) cnt를 누적합으로 변환 (안정 정렬을 위해)
    // 4) 뒤에서부터 순회하며 sorted에 배치
    // 5) sorted → arr 복사
}`,
    solution: `const int MAXN = 100001;
const int MAXVAL = 10001;

int arr[MAXN], sorted[MAXN];
int cnt[MAXVAL];
int n;

void countingSort() {
    // 1) cnt 초기화
    for (int i = 0; i < MAXVAL; i++) cnt[i] = 0;

    // 2) 등장 횟수 카운트
    for (int i = 0; i < n; i++) cnt[arr[i]]++;

    // 3) 누적합 (cnt[v] = v 이하 값의 총 개수)
    for (int i = 1; i < MAXVAL; i++) cnt[i] += cnt[i - 1];

    // 4) 뒤에서부터 배치 (안정 정렬 보장)
    for (int i = n - 1; i >= 0; i--) {
        sorted[--cnt[arr[i]]] = arr[i];
    }

    // 5) 복사
    for (int i = 0; i < n; i++) arr[i] = sorted[i];
}`,
    keywords: ['non-comparison sort', 'stable sort', 'O(n+k)', 'counting'],
    testCases: [
      {
        name: "기본 정렬",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 5;\n    int input[] = {4, 2, 0, 3, 1};\n    for (int i = 0; i < n; i++) arr[i] = input[i];\n    countingSort();\n    for (int i = 0; i < n; i++) { if (i) printf(" "); printf("%d", arr[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "0 1 2 3 4\n"
      },
      {
        name: "중복 값",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 7;\n    int input[] = {3, 0, 3, 0, 1, 1, 2};\n    for (int i = 0; i < n; i++) arr[i] = input[i];\n    countingSort();\n    for (int i = 0; i < n; i++) { if (i) printf(" "); printf("%d", arr[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "0 0 1 1 2 3 3\n"
      },
      {
        name: "단일 원소",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 1;\n    arr[0] = 5;\n    countingSort();\n    printf("%d\\n", arr[0]);\n    return 0;\n}`,
        expected: "5\n"
      }
    ]
  },
  {
    id: 'heap',
    name: 'Max Heap',
    category: 'Data Structure',
    difficulty: 2,
    description: '배열 기반 최대 힙. push, pop, top 연산 구현.',
    skeleton: `// Max Heap (No STL)
// push(val), pop(), top() 연산을 구현하시오.

const int MAXN = 100001;

struct MaxHeap {
    int data[MAXN];
    int sz;

    void init() { sz = 0; }

    void push(int val) {
        // TODO: 구현
    }

    int top() {
        // TODO: 구현
        return -1;
    }

    void pop() {
        // TODO: 구현
    }
};`,
    solution: `const int MAXN = 100001;

struct MaxHeap {
    int data[MAXN];
    int sz;

    void init() { sz = 0; }

    void push(int val) {
        data[sz] = val;
        int i = sz++;
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[parent] >= data[i]) break;
            int t = data[parent]; data[parent] = data[i]; data[i] = t;
            i = parent;
        }
    }

    int top() {
        return data[0];
    }

    void pop() {
        data[0] = data[--sz];
        int i = 0;
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, largest = i;
            if (l < sz && data[l] > data[largest]) largest = l;
            if (r < sz && data[r] > data[largest]) largest = r;
            if (largest == i) break;
            int t = data[i]; data[i] = data[largest]; data[largest] = t;
            i = largest;
        }
    }
};`,
    keywords: ['binary heap', 'complete binary tree', 'heapify'],
    testCases: [
      {
        name: "push/top/pop 기본",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    MaxHeap h;\n    h.init();\n    h.push(3); h.push(1); h.push(5); h.push(2);\n    printf("%d\\n", h.top());\n    h.pop();\n    printf("%d\\n", h.top());\n    h.pop();\n    printf("%d\\n", h.top());\n    return 0;\n}`,
        expected: "5\n3\n2\n"
      },
      {
        name: "순차 추출",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    MaxHeap h;\n    h.init();\n    int vals[] = {10, 4, 7, 1, 9, 3};\n    for (int i = 0; i < 6; i++) h.push(vals[i]);\n    while (h.sz > 0) { printf("%d ", h.top()); h.pop(); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "10 9 7 4 3 1 \n"
      }
    ]
  },
  {
    id: 'priority_queue',
    name: 'Priority Queue',
    category: 'Data Structure',
    difficulty: 2,
    description: '힙 기반 우선순위 큐. 최솟값 추출 지원.',
    skeleton: `// Min Priority Queue (No STL)
// push(val), pop(), top(), empty() 구현

const int MAXN = 100001;

struct PQ {
    int heap[MAXN];
    int sz;

    void init() { sz = 0; }
    bool empty() { return sz == 0; }

    void push(int val) {
        // TODO: 구현
    }

    int top() {
        // TODO: 구현
        return -1;
    }

    void pop() {
        // TODO: 구현
    }
};`,
    solution: `const int MAXN = 100001;

struct PQ {
    int heap[MAXN];
    int sz;

    void init() { sz = 0; }
    bool empty() { return sz == 0; }

    void push(int val) {
        heap[sz] = val;
        int i = sz++;
        while (i > 0) {
            int p = (i - 1) / 2;
            if (heap[p] <= heap[i]) break;
            int t = heap[p]; heap[p] = heap[i]; heap[i] = t;
            i = p;
        }
    }

    int top() {
        return heap[0];
    }

    void pop() {
        heap[0] = heap[--sz];
        int i = 0;
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
            if (l < sz && heap[l] < heap[smallest]) smallest = l;
            if (r < sz && heap[r] < heap[smallest]) smallest = r;
            if (smallest == i) break;
            int t = heap[i]; heap[i] = heap[smallest]; heap[smallest] = t;
            i = smallest;
        }
    }
};`,
    keywords: ['min-heap', 'priority queue', 'Dijkstra'],
    testCases: [
      {
        name: "최솟값 추출",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    PQ pq;\n    pq.init();\n    pq.push(5); pq.push(1); pq.push(3); pq.push(2);\n    printf("%d\\n", pq.top());\n    pq.pop();\n    printf("%d\\n", pq.top());\n    pq.pop();\n    printf("%d\\n", pq.top());\n    return 0;\n}`,
        expected: "1\n2\n3\n"
      },
      {
        name: "empty 체크",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    PQ pq;\n    pq.init();\n    printf("%d\\n", pq.empty());\n    pq.push(10);\n    printf("%d\\n", pq.empty());\n    pq.pop();\n    printf("%d\\n", pq.empty());\n    return 0;\n}`,
        expected: "1\n0\n1\n"
      },
      {
        name: "순차 추출",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    PQ pq;\n    pq.init();\n    int vals[] = {9, 1, 7, 3, 5};\n    for (int i = 0; i < 5; i++) pq.push(vals[i]);\n    while (!pq.empty()) { printf("%d ", pq.top()); pq.pop(); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "1 3 5 7 9 \n"
      }
    ]
  },
  {
    id: 'lazy_segment_tree',
    name: 'Lazy Segment Tree',
    category: 'Data Structure',
    difficulty: 4,
    description: '구간 합 쿼리 + 구간 업데이트를 O(log n)에 처리하는 세그먼트 트리.',
    skeleton: `// Lazy Segment Tree (No STL)
// 구간 합 쿼리, 구간 덧셈 업데이트
// build(), update(l, r, val), query(l, r)

const int MAXN = 100001;

typedef long long ll;

struct LazySegTree {
    ll tree[4 * MAXN];
    ll lazy[4 * MAXN];
    int n;

    void init(int _n) {
        n = _n;
        // TODO: 초기화
    }

    void build(int node, int start, int end, int arr[]) {
        // TODO: 구현
    }

    void propagate(int node, int start, int end) {
        // TODO: lazy 전파
    }

    void update(int node, int start, int end, int l, int r, ll val) {
        // TODO: 구간 업데이트
    }

    ll query(int node, int start, int end, int l, int r) {
        // TODO: 구간 쿼리
        return 0;
    }
};`,
    solution: `const int MAXN = 100001;
typedef long long ll;

struct LazySegTree {
    ll tree[4 * MAXN];
    ll lazy[4 * MAXN];
    int n;

    void init(int _n) {
        n = _n;
        for (int i = 0; i < 4 * n; i++) tree[i] = lazy[i] = 0;
    }

    void build(int node, int start, int end, int arr[]) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = (start + end) / 2;
        build(2 * node, start, mid, arr);
        build(2 * node + 1, mid + 1, end, arr);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    void propagate(int node, int start, int end) {
        if (lazy[node] == 0) return;
        tree[node] += lazy[node] * (end - start + 1);
        if (start != end) {
            lazy[2 * node] += lazy[node];
            lazy[2 * node + 1] += lazy[node];
        }
        lazy[node] = 0;
    }

    void update(int node, int start, int end, int l, int r, ll val) {
        propagate(node, start, end);
        if (r < start || end < l) return;
        if (l <= start && end <= r) {
            lazy[node] += val;
            propagate(node, start, end);
            return;
        }
        int mid = (start + end) / 2;
        update(2 * node, start, mid, l, r, val);
        update(2 * node + 1, mid + 1, end, l, r, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    ll query(int node, int start, int end, int l, int r) {
        propagate(node, start, end);
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return query(2 * node, start, mid, l, r)
             + query(2 * node + 1, mid + 1, end, l, r);
    }
};`,
    keywords: ['segment tree', 'lazy propagation', 'range query', 'range update'],
    testCases: [
      {
        name: "구간 합 + 업데이트",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    LazySegTree seg;\n    int a[] = {1, 2, 3, 4, 5};\n    seg.init(5);\n    seg.build(1, 0, 4, a);\n    printf("%lld\\n", seg.query(1, 0, 4, 0, 4));\n    printf("%lld\\n", seg.query(1, 0, 4, 1, 3));\n    seg.update(1, 0, 4, 1, 3, 10);\n    printf("%lld\\n", seg.query(1, 0, 4, 0, 4));\n    printf("%lld\\n", seg.query(1, 0, 4, 2, 2));\n    return 0;\n}`,
        expected: "15\n9\n45\n13\n"
      },
      {
        name: "전체 구간 업데이트",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    LazySegTree seg;\n    int a[] = {0, 0, 0};\n    seg.init(3);\n    seg.build(1, 0, 2, a);\n    seg.update(1, 0, 2, 0, 2, 5);\n    printf("%lld\\n", seg.query(1, 0, 2, 0, 2));\n    seg.update(1, 0, 2, 0, 0, 3);\n    printf("%lld\\n", seg.query(1, 0, 2, 0, 0));\n    return 0;\n}`,
        expected: "15\n8\n"
      }
    ]
  },
  {
    id: 'nn_chain_knn',
    name: 'NN Chain + KNN',
    category: 'Clustering',
    difficulty: 4,
    description: 'K-최근접 이웃 탐색 + NN Chain 계층적 군집화. KNN으로 후보 축소 후 NN Chain으로 병합.',
    skeleton: `// NN Chain + K-Nearest Neighbors (No STL)
// 1) KNN: 각 점에서 K개의 최근접 이웃을 구한다.
// 2) NN Chain: KNN 결과를 활용하여 계층적 군집화를 수행한다.

const int MAXN = 1001;
const int MAXK = 20;

double px[MAXN], py[MAXN]; // 점 좌표
int n;

// ─── Part 1: KNN ───
int knnResult[MAXN][MAXK]; // knnResult[i][j] = i의 j번째 최근접 이웃
int K;

double sqDist(int a, int b) {
    // TODO: 두 점의 제곱 거리
    return 0.0;
}

void knn() {
    // TODO: 각 점에 대해 K개의 최근접 이웃을 구하시오
    // 힌트: 최대 힙을 활용하면 O(nK)가 아닌 효율적 구현 가능
}

// ─── Part 2: NN Chain ───
double dist[MAXN][MAXN]; // 클러스터 간 거리
int clusterSize[MAXN];
bool alive[MAXN];

int chain[MAXN];
int chainTop;

int mergeOrder[MAXN][2]; // 병합 순서 기록
int mergeCnt;

void initClustering() {
    // TODO: 거리 행렬 및 클러스터 초기화
}

int nearestAlive(int c) {
    // TODO: 살아있는 클러스터 중 c의 최근접 이웃 반환
    return -1;
}

void mergeCluster(int a, int b) {
    // TODO: 클러스터 병합 + Ward's method 거리 갱신
}

void nnChain() {
    // TODO: NN Chain 메인 루프
    // 상호 최근접 쌍을 찾아 병합 반복
}`,
    solution: `const int MAXN = 1001;
const int MAXK = 20;

double px[MAXN], py[MAXN];
int n;

// ─── Part 1: KNN ───
int knnResult[MAXN][MAXK];
int K;

double sqDist(int a, int b) {
    double dx = px[a] - px[b], dy = py[a] - py[b];
    return dx * dx + dy * dy;
}

// 최대 힙으로 K개 유지
struct KHeap {
    double d[MAXK + 1];
    int id[MAXK + 1];
    int sz;

    void init() { sz = 0; }

    void push(double dist, int idx) {
        d[sz] = dist; id[sz] = idx;
        int i = sz++;
        while (i > 0) {
            int p = (i - 1) / 2;
            if (d[p] >= d[i]) break;
            double td = d[p]; d[p] = d[i]; d[i] = td;
            int ti = id[p]; id[p] = id[i]; id[i] = ti;
            i = p;
        }
    }

    void popMax() {
        d[0] = d[--sz]; id[0] = id[sz];
        int i = 0;
        while (true) {
            int l = 2*i+1, r = 2*i+2, big = i;
            if (l < sz && d[l] > d[big]) big = l;
            if (r < sz && d[r] > d[big]) big = r;
            if (big == i) break;
            double td = d[i]; d[i] = d[big]; d[big] = td;
            int ti = id[i]; id[i] = id[big]; id[big] = ti;
            i = big;
        }
    }

    double maxDist() { return d[0]; }
} kheap;

void knn() {
    for (int i = 0; i < n; i++) {
        kheap.init();
        for (int j = 0; j < n; j++) {
            if (i == j) continue;
            double d = sqDist(i, j);
            if (kheap.sz < K) {
                kheap.push(d, j);
            } else if (d < kheap.maxDist()) {
                kheap.popMax();
                kheap.push(d, j);
            }
        }
        // 힙에서 결과 추출 (거리 오름차순 정렬은 생략, 순서 무관)
        for (int j = 0; j < kheap.sz; j++) {
            knnResult[i][j] = kheap.id[j];
        }
    }
}

// ─── Part 2: NN Chain ───
double dist[MAXN][MAXN];
int clusterSize[MAXN];
bool alive[MAXN];

int chain[MAXN];
int chainTop;

int mergeOrder[MAXN][2];
int mergeCnt;

void initClustering() {
    mergeCnt = 0;
    chainTop = 0;
    for (int i = 0; i < n; i++) {
        alive[i] = true;
        clusterSize[i] = 1;
        for (int j = 0; j < n; j++) {
            dist[i][j] = sqDist(i, j);
        }
    }
}

int nearestAlive(int c) {
    int best = -1;
    double bestD = 1e18;
    for (int i = 0; i < n; i++) {
        if (i != c && alive[i] && dist[c][i] < bestD) {
            bestD = dist[c][i];
            best = i;
        }
    }
    return best;
}

void mergeCluster(int a, int b) {
    mergeOrder[mergeCnt][0] = a;
    mergeOrder[mergeCnt][1] = b;
    mergeCnt++;

    int newSz = clusterSize[a] + clusterSize[b];
    // Ward's method
    for (int i = 0; i < n; i++) {
        if (!alive[i] || i == a || i == b) continue;
        double da = dist[a][i], db = dist[b][i], dab = dist[a][b];
        int si = clusterSize[i], sa = clusterSize[a], sb = clusterSize[b];
        dist[a][i] = dist[i][a] =
            ((si + sa) * da + (si + sb) * db - si * dab) / (si + newSz);
    }
    clusterSize[a] = newSz;
    alive[b] = false;
}

void nnChain() {
    knn(); // KNN 전처리
    initClustering();

    int remaining = n;
    while (remaining > 1) {
        if (chainTop == 0) {
            for (int i = 0; i < n; i++) {
                if (alive[i]) { chain[chainTop++] = i; break; }
            }
        }

        int c = chain[chainTop - 1];
        int nn = nearestAlive(c);

        if (chainTop >= 2 && chain[chainTop - 2] == nn) {
            chainTop -= 2;
            mergeCluster(c, nn);
            remaining--;
        } else {
            chain[chainTop++] = nn;
        }
    }
}`,
    keywords: ['KNN', 'K-nearest neighbors', 'hierarchical clustering', 'NN chain', 'Ward linkage', 'max-heap'],
    testCases: [
      {
        name: "3점 군집화",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 3; K = 2;\n    px[0]=0; py[0]=0; px[1]=1; py[1]=0; px[2]=10; py[2]=0;\n    nnChain();\n    printf("%d\\n", mergeCnt);\n    return 0;\n}`,
        expected: "2\n"
      },
      {
        name: "4점 군집화",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 4; K = 3;\n    px[0]=0; py[0]=0; px[1]=1; py[1]=0; px[2]=10; py[2]=0; px[3]=11; py[3]=0;\n    nnChain();\n    printf("%d\\n", mergeCnt);\n    return 0;\n}`,
        expected: "3\n"
      }
    ]
  },
  {
    id: 'two_opt',
    name: '2-opt (TSP)',
    category: 'Optimization',
    difficulty: 3,
    description: 'TSP 근사 최적화. 경로에서 두 엣지를 교환하여 개선.',
    skeleton: `// 2-opt Algorithm for TSP (No STL)
// tour[] 배열의 순서를 개선하시오.

const int MAXN = 1001;

double x[MAXN], y[MAXN]; // 좌표
int tour[MAXN];           // 현재 경로
int n;

double dist(int a, int b) {
    // TODO: 두 점 사이 거리
    return 0.0;
}

double tourLength() {
    // TODO: 전체 경로 길이 계산
    return 0.0;
}

void reverse(int i, int j) {
    // TODO: tour[i..j] 구간 뒤집기
}

bool twoOptStep() {
    // TODO: 개선 가능한 2-opt swap 찾아서 수행
    // 개선했으면 true, 아니면 false
    return false;
}

void twoOpt() {
    // TODO: 더 이상 개선 불가할 때까지 반복
}`,
    solution: `const int MAXN = 1001;

double x[MAXN], y[MAXN];
int tour[MAXN];
int n;

double dist(int a, int b) {
    double dx = x[a] - x[b], dy = y[a] - y[b];
    // sqrt 직접 구현 또는 컴파일러 내장 사용
    double val = dx * dx + dy * dy;
    // Newton's method for sqrt
    double r = val;
    if (r > 0) {
        for (int k = 0; k < 30; k++) r = (r + val / r) * 0.5;
    }
    return r;
}

double tourLength() {
    double len = 0;
    for (int i = 0; i < n; i++) {
        len += dist(tour[i], tour[(i + 1) % n]);
    }
    return len;
}

void reverse(int i, int j) {
    while (i < j) {
        int t = tour[i]; tour[i] = tour[j]; tour[j] = t;
        i++; j--;
    }
}

bool twoOptStep() {
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 2; j < n; j++) {
            if (i == 0 && j == n - 1) continue;
            int a = tour[i], b = tour[i + 1];
            int c = tour[j], d = tour[(j + 1) % n];
            double before = dist(a, b) + dist(c, d);
            double after  = dist(a, c) + dist(b, d);
            if (after < before - 1e-10) {
                reverse(i + 1, j);
                return true;
            }
        }
    }
    return false;
}

void twoOpt() {
    while (twoOptStep());
}`,
    keywords: ['TSP', 'local search', 'tour improvement'],
    testCases: [
      {
        name: "사각형 경로 개선",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 4;\n    x[0]=0; y[0]=0; x[1]=1; y[1]=0; x[2]=0; y[2]=1; x[3]=1; y[3]=1;\n    tour[0]=0; tour[1]=2; tour[2]=1; tour[3]=3;\n    double before = tourLength();\n    twoOpt();\n    double after = tourLength();\n    printf("%s\\n", after <= before ? "OK" : "FAIL");\n    return 0;\n}`,
        expected: "OK\n"
      },
      {
        name: "이미 최적",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 3;\n    x[0]=0; y[0]=0; x[1]=1; y[1]=0; x[2]=0.5; y[2]=1;\n    tour[0]=0; tour[1]=1; tour[2]=2;\n    double before = tourLength();\n    twoOpt();\n    double after = tourLength();\n    double diff = before - after;\n    if (diff < 0) diff = -diff;\n    printf("%s\\n", diff < 1e-6 ? "OK" : "FAIL");\n    return 0;\n}`,
        expected: "OK\n"
      }
    ]
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra (with Heap)',
    category: 'Graph',
    difficulty: 3,
    description: '힙 기반 다익스트라 최단경로. O((V+E) log V)',
    skeleton: `// Dijkstra's Algorithm with custom Heap (No STL)
// 그래프에서 시작점 src로부터 최단거리를 구하시오.

const int MAXN = 100001;
const int MAXE = 200001;
const int INF = 0x3f3f3f3f;

struct Edge {
    int to, w, next;
} edges[MAXE];
int head[MAXN], edgeCnt;

void initGraph() {
    // TODO: 그래프 초기화
}

void addEdge(int u, int v, int w) {
    // TODO: 간선 추가 (인접 리스트)
}

int dist[MAXN];
bool visited[MAXN];

// 직접 구현한 힙
struct Node { int v, d; };
Node heap[MAXN];
int heapSz;

void heapPush(int v, int d) {
    // TODO
}

Node heapPop() {
    // TODO
    return {0, 0};
}

void dijkstra(int src, int n) {
    // TODO: 다익스트라 구현
}`,
    solution: `const int MAXN = 100001;
const int MAXE = 200001;
const int INF = 0x3f3f3f3f;

struct Edge {
    int to, w, next;
} edges[MAXE];
int head[MAXN], edgeCnt;

void initGraph() {
    for (int i = 0; i < MAXN; i++) head[i] = -1;
    edgeCnt = 0;
}

void addEdge(int u, int v, int w) {
    edges[edgeCnt] = {v, w, head[u]};
    head[u] = edgeCnt++;
}

int dist[MAXN];
bool visited[MAXN];

struct Node { int v, d; };
Node heap[MAXN];
int heapSz;

void heapPush(int v, int d) {
    heap[heapSz] = {v, d};
    int i = heapSz++;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (heap[p].d <= heap[i].d) break;
        Node t = heap[p]; heap[p] = heap[i]; heap[i] = t;
        i = p;
    }
}

Node heapPop() {
    Node top = heap[0];
    heap[0] = heap[--heapSz];
    int i = 0;
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, s = i;
        if (l < heapSz && heap[l].d < heap[s].d) s = l;
        if (r < heapSz && heap[r].d < heap[s].d) s = r;
        if (s == i) break;
        Node t = heap[i]; heap[i] = heap[s]; heap[s] = t;
        i = s;
    }
    return top;
}

void dijkstra(int src, int n) {
    for (int i = 0; i < n; i++) { dist[i] = INF; visited[i] = false; }
    dist[src] = 0;
    heapSz = 0;
    heapPush(src, 0);

    while (heapSz > 0) {
        Node cur = heapPop();
        if (visited[cur.v]) continue;
        visited[cur.v] = true;

        for (int e = head[cur.v]; e != -1; e = edges[e].next) {
            int nv = edges[e].to, nw = cur.d + edges[e].w;
            if (nw < dist[nv]) {
                dist[nv] = nw;
                heapPush(nv, nw);
            }
        }
    }
}`,
    keywords: ['shortest path', 'min-heap', 'greedy'],
    testCases: [
      {
        name: "기본 그래프",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1,4); addEdge(0,2,1); addEdge(2,1,2); addEdge(1,3,1); addEdge(2,3,5);\n    dijkstra(0, 4);\n    for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", dist[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "0 3 1 4\n"
      },
      {
        name: "단일 정점",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    dijkstra(0, 1);\n    printf("%d\\n", dist[0]);\n    return 0;\n}`,
        expected: "0\n"
      },
      {
        name: "도달 불가",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1,3);\n    dijkstra(0, 3);\n    printf("%d %d %d\\n", dist[0], dist[1], dist[2] >= 0x3f3f3f3f ? -1 : dist[2]);\n    return 0;\n}`,
        expected: "0 3 -1\n"
      }
    ]
  },
  {
    id: 'quick_sort',
    name: 'Quick Sort',
    category: 'Sorting',
    difficulty: 2,
    description: '파티션 기반 제자리 정렬. 평균 O(n log n)',
    skeleton: `// Quick Sort (No STL)
// 배열 arr[0..n-1]을 오름차순 정렬하시오.

const int MAXN = 100001;
int arr[MAXN];
int n;

void swap(int &a, int &b) {
    int t = a; a = b; b = t;
}

int partition(int left, int right) {
    // TODO: 피벗 선택 및 파티션
    return left;
}

void quickSort(int left, int right) {
    // TODO: 구현
}`,
    solution: `const int MAXN = 100001;
int arr[MAXN];
int n;

void swap(int &a, int &b) {
    int t = a; a = b; b = t;
}

int partition(int left, int right) {
    // median-of-three 피벗 선택
    int mid = (left + right) / 2;
    if (arr[left] > arr[mid]) swap(arr[left], arr[mid]);
    if (arr[left] > arr[right]) swap(arr[left], arr[right]);
    if (arr[mid] > arr[right]) swap(arr[mid], arr[right]);
    swap(arr[mid], arr[right - 1]);
    int pivot = arr[right - 1];

    int i = left, j = right - 1;
    while (true) {
        while (arr[++i] < pivot);
        while (arr[--j] > pivot);
        if (i >= j) break;
        swap(arr[i], arr[j]);
    }
    swap(arr[i], arr[right - 1]);
    return i;
}

void quickSort(int left, int right) {
    if (left >= right) return;
    int p = partition(left, right);
    quickSort(left, p - 1);
    quickSort(p + 1, right);
}`,
    keywords: ['partition', 'in-place sort', 'divide and conquer'],
    testCases: [
      {
        name: "기본 정렬",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 6;\n    int input[] = {3, 6, 1, 5, 2, 4};\n    for (int i = 0; i < n; i++) arr[i] = input[i];\n    quickSort(0, n - 1);\n    for (int i = 0; i < n; i++) { if (i) printf(" "); printf("%d", arr[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "1 2 3 4 5 6\n"
      },
      {
        name: "중복 포함",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 5;\n    int input[] = {2, 2, 1, 1, 3};\n    for (int i = 0; i < n; i++) arr[i] = input[i];\n    quickSort(0, n - 1);\n    for (int i = 0; i < n; i++) { if (i) printf(" "); printf("%d", arr[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "1 1 2 2 3\n"
      },
      {
        name: "역순 정렬",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 4;\n    int input[] = {4, 3, 2, 1};\n    for (int i = 0; i < n; i++) arr[i] = input[i];\n    quickSort(0, n - 1);\n    for (int i = 0; i < n; i++) { if (i) printf(" "); printf("%d", arr[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "1 2 3 4\n"
      }
    ]
  },
  {
    id: 'union_find',
    name: 'Union-Find (DSU)',
    category: 'Data Structure',
    difficulty: 2,
    description: 'Disjoint Set Union. 경로 압축 + 랭크 기반 합치기.',
    skeleton: `// Union-Find / Disjoint Set Union (No STL)
// find(x), unite(a, b), sameSet(a, b) 구현

const int MAXN = 100001;

int parent[MAXN];
int rank_[MAXN];

void init(int n) {
    // TODO: 초기화
}

int find(int x) {
    // TODO: 경로 압축
    return x;
}

bool unite(int a, int b) {
    // TODO: 랭크 기반 합치기
    // 이미 같은 집합이면 false
    return false;
}

bool sameSet(int a, int b) {
    return find(a) == find(b);
}`,
    solution: `const int MAXN = 100001;

int parent[MAXN];
int rank_[MAXN];

void init(int n) {
    for (int i = 0; i < n; i++) {
        parent[i] = i;
        rank_[i] = 0;
    }
}

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (rank_[a] < rank_[b]) { int t = a; a = b; b = t; }
    parent[b] = a;
    if (rank_[a] == rank_[b]) rank_[a]++;
    return true;
}

bool sameSet(int a, int b) {
    return find(a) == find(b);
}`,
    keywords: ['disjoint set', 'path compression', 'union by rank'],
    testCases: [
      {
        name: "기본 연산",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    init(5);\n    printf("%d\\n", sameSet(0, 1));\n    unite(0, 1);\n    printf("%d\\n", sameSet(0, 1));\n    unite(2, 3);\n    printf("%d\\n", sameSet(0, 3));\n    unite(1, 3);\n    printf("%d\\n", sameSet(0, 3));\n    return 0;\n}`,
        expected: "0\n1\n0\n1\n"
      },
      {
        name: "중복 unite",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    init(3);\n    printf("%d\\n", unite(0, 1));\n    printf("%d\\n", unite(0, 1));\n    printf("%d\\n", unite(1, 0));\n    return 0;\n}`,
        expected: "1\n0\n0\n"
      },
      {
        name: "경로 압축 확인",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    init(5);\n    unite(0,1); unite(1,2); unite(2,3); unite(3,4);\n    int r = find(4);\n    printf("%d\\n", find(0) == r);\n    printf("%d\\n", find(2) == r);\n    return 0;\n}`,
        expected: "1\n1\n"
      }
    ]
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST",
    category: 'Graph',
    difficulty: 3,
    description: '간선 정렬 + Union-Find로 최소 신장 트리. O(E log E)',
    skeleton: `// Kruskal's MST (No STL)
// 간선 정렬은 직접 구현 (merge sort 등)
// Union-Find 사용

const int MAXN = 100001;
const int MAXE = 200001;

struct Edge {
    int u, v, w;
} edges[MAXE];
int edgeCnt;

int parent[MAXN], rank_[MAXN];

int find(int x) {
    // TODO: 경로 압축
    return x;
}

bool unite(int a, int b) {
    // TODO
    return false;
}

void sortEdges() {
    // TODO: 간선을 가중치 기준으로 정렬 (No STL sort!)
}

long long kruskal(int n) {
    // TODO: MST 가중치 합 반환
    return 0;
}`,
    solution: `const int MAXN = 100001;
const int MAXE = 200001;

struct Edge {
    int u, v, w;
} edges[MAXE], tmp[MAXE];
int edgeCnt;

int parent[MAXN], rank_[MAXN];

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (rank_[a] < rank_[b]) { int t = a; a = b; b = t; }
    parent[b] = a;
    if (rank_[a] == rank_[b]) rank_[a]++;
    return true;
}

void mergeEdge(int l, int m, int r) {
    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r) {
        if (edges[i].w <= edges[j].w) tmp[k++] = edges[i++];
        else tmp[k++] = edges[j++];
    }
    while (i <= m) tmp[k++] = edges[i++];
    while (j <= r) tmp[k++] = edges[j++];
    for (int t = l; t <= r; t++) edges[t] = tmp[t];
}

void msort(int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    msort(l, m);
    msort(m + 1, r);
    mergeEdge(l, m, r);
}

void sortEdges() {
    msort(0, edgeCnt - 1);
}

long long kruskal(int n) {
    for (int i = 0; i < n; i++) { parent[i] = i; rank_[i] = 0; }
    sortEdges();
    long long mst = 0;
    int cnt = 0;
    for (int i = 0; i < edgeCnt && cnt < n - 1; i++) {
        if (unite(edges[i].u, edges[i].v)) {
            mst += edges[i].w;
            cnt++;
        }
    }
    return mst;
}`,
    keywords: ['MST', 'union-find', 'greedy', 'edge sort'],
    testCases: [
      {
        name: "기본 MST",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    edgeCnt = 0;\n    edges[edgeCnt++] = {0,1,4};\n    edges[edgeCnt++] = {0,2,1};\n    edges[edgeCnt++] = {1,2,2};\n    edges[edgeCnt++] = {1,3,5};\n    edges[edgeCnt++] = {2,3,3};\n    printf("%lld\\n", kruskal(4));\n    return 0;\n}`,
        expected: "6\n"
      },
      {
        name: "단일 간선",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    edgeCnt = 0;\n    edges[edgeCnt++] = {0,1,7};\n    printf("%lld\\n", kruskal(2));\n    return 0;\n}`,
        expected: "7\n"
      },
      {
        name: "삼각형 그래프",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    edgeCnt = 0;\n    edges[edgeCnt++] = {0,1,1};\n    edges[edgeCnt++] = {1,2,2};\n    edges[edgeCnt++] = {0,2,3};\n    printf("%lld\\n", kruskal(3));\n    return 0;\n}`,
        expected: "3\n"
      }
    ]
  },
  {
    id: 'bfs',
    name: 'BFS (with Queue)',
    category: 'Graph',
    difficulty: 1,
    description: '배열 기반 큐로 BFS 구현.',
    skeleton: `// BFS with custom Queue (No STL)
// 시작점 src에서 모든 정점까지의 최단 거리(간선 수)를 구하시오.

const int MAXN = 100001;
const int MAXE = 200001;

struct Edge {
    int to, next;
} edges[MAXE];
int head[MAXN], edgeCnt;

void initGraph() {
    // TODO
}

void addEdge(int u, int v) {
    // TODO
}

int dist[MAXN];
int que[MAXN];
int qf, qr;

void bfs(int src, int n) {
    // TODO: BFS 구현
}`,
    solution: `const int MAXN = 100001;
const int MAXE = 200001;

struct Edge {
    int to, next;
} edges[MAXE];
int head[MAXN], edgeCnt;

void initGraph() {
    for (int i = 0; i < MAXN; i++) head[i] = -1;
    edgeCnt = 0;
}

void addEdge(int u, int v) {
    edges[edgeCnt] = {v, head[u]};
    head[u] = edgeCnt++;
}

int dist[MAXN];
int que[MAXN];
int qf, qr;

void bfs(int src, int n) {
    for (int i = 0; i < n; i++) dist[i] = -1;
    dist[src] = 0;
    qf = qr = 0;
    que[qr++] = src;

    while (qf < qr) {
        int u = que[qf++];
        for (int e = head[u]; e != -1; e = edges[e].next) {
            int v = edges[e].to;
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                que[qr++] = v;
            }
        }
    }
}`,
    keywords: ['breadth-first search', 'queue', 'shortest path unweighted'],
    testCases: [
      {
        name: "기본 BFS",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(1,0); addEdge(0,2); addEdge(2,0);\n    addEdge(1,3); addEdge(3,1); addEdge(2,3); addEdge(3,2);\n    bfs(0, 4);\n    for (int i = 0; i < 4; i++) { if (i) printf(" "); printf("%d", dist[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "0 1 1 2\n"
      },
      {
        name: "도달 불가",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(1,0);\n    bfs(0, 3);\n    printf("%d %d %d\\n", dist[0], dist[1], dist[2]);\n    return 0;\n}`,
        expected: "0 1 -1\n"
      },
      {
        name: "선형 그래프",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(1,2); addEdge(2,3); addEdge(3,4);\n    bfs(0, 5);\n    for (int i = 0; i < 5; i++) { if (i) printf(" "); printf("%d", dist[i]); }\n    printf("\\n");\n    return 0;\n}`,
        expected: "0 1 2 3 4\n"
      }
    ]
  },
  {
    id: 'topo_sort',
    name: 'Topological Sort',
    category: 'Graph',
    difficulty: 2,
    description: 'DAG에서 위상 정렬. 큐 기반 Kahn 알고리즘.',
    skeleton: `// Topological Sort - Kahn's Algorithm (No STL)

const int MAXN = 100001;
const int MAXE = 200001;

struct Edge {
    int to, next;
} edges[MAXE];
int head[MAXN], edgeCnt;
int inDeg[MAXN];

void initGraph() {
    // TODO
}

void addEdge(int u, int v) {
    // TODO: 간선 추가 + inDeg 갱신
}

int result[MAXN]; // 위상 정렬 결과
int que[MAXN];

bool topoSort(int n) {
    // TODO: 위상 정렬. 사이클 있으면 false 반환
    return true;
}`,
    solution: `const int MAXN = 100001;
const int MAXE = 200001;

struct Edge {
    int to, next;
} edges[MAXE];
int head[MAXN], edgeCnt;
int inDeg[MAXN];

void initGraph() {
    for (int i = 0; i < MAXN; i++) { head[i] = -1; inDeg[i] = 0; }
    edgeCnt = 0;
}

void addEdge(int u, int v) {
    edges[edgeCnt] = {v, head[u]};
    head[u] = edgeCnt++;
    inDeg[v]++;
}

int result[MAXN];
int que[MAXN];

bool topoSort(int n) {
    int qf = 0, qr = 0, cnt = 0;
    for (int i = 0; i < n; i++) {
        if (inDeg[i] == 0) que[qr++] = i;
    }
    while (qf < qr) {
        int u = que[qf++];
        result[cnt++] = u;
        for (int e = head[u]; e != -1; e = edges[e].next) {
            int v = edges[e].to;
            if (--inDeg[v] == 0) que[qr++] = v;
        }
    }
    return cnt == n; // false면 사이클 존재
}`,
    keywords: ['topological order', 'DAG', 'Kahn algorithm', 'in-degree'],
    testCases: [
      {
        name: "기본 DAG",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(0,2); addEdge(1,3); addEdge(2,3);\n    bool ok = topoSort(4);\n    printf("%d\\n", ok);\n    // result에서 0이 3보다 먼저 나와야 함\n    int pos[4];\n    for (int i = 0; i < 4; i++) pos[result[i]] = i;\n    printf("%d\\n", pos[0] < pos[3]);\n    printf("%d\\n", pos[1] < pos[3]);\n    return 0;\n}`,
        expected: "1\n1\n1\n"
      },
      {
        name: "사이클 감지",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(1,2); addEdge(2,0);\n    bool ok = topoSort(3);\n    printf("%d\\n", ok);\n    return 0;\n}`,
        expected: "0\n"
      }
    ]
  },
  {
    id: 'lca_binary_lifting',
    name: 'LCA (Binary Lifting)',
    category: 'Tree',
    difficulty: 4,
    description: '이진 리프팅으로 LCA를 O(log n)에 구하기.',
    skeleton: `// LCA with Binary Lifting (No STL)

const int MAXN = 100001;
const int LOG = 17;

struct Edge {
    int to, next;
} edges[2 * MAXN];
int head[MAXN], edgeCnt;

int depth[MAXN];
int up[MAXN][LOG]; // up[v][k] = 2^k번째 조상

void initGraph() {
    // TODO
}

void addEdge(int u, int v) {
    // TODO
}

void dfs(int v, int p, int d) {
    // TODO: depth, up 테이블 채우기
}

void preprocess(int root) {
    // TODO: DFS 시작
}

int lca(int u, int v) {
    // TODO: LCA 구하기
    return 0;
}`,
    solution: `const int MAXN = 100001;
const int LOG = 17;

struct Edge {
    int to, next;
} edges[2 * MAXN];
int head[MAXN], edgeCnt;

int depth[MAXN];
int up[MAXN][LOG];

void initGraph() {
    for (int i = 0; i < MAXN; i++) head[i] = -1;
    edgeCnt = 0;
}

void addEdge(int u, int v) {
    edges[edgeCnt] = {v, head[u]};
    head[u] = edgeCnt++;
}

// 반복적 DFS (스택 오버플로 방지)
int stk[MAXN], sparent[MAXN];
void dfs(int root) {
    int top = 0;
    stk[top] = root; sparent[top] = -1;
    depth[root] = 0;
    up[root][0] = root;

    while (top >= 0) {
        int v = stk[top], p = sparent[top];
        top--;

        up[v][0] = (p == -1) ? v : p;
        for (int k = 1; k < LOG; k++)
            up[v][k] = up[up[v][k - 1]][k - 1];

        for (int e = head[v]; e != -1; e = edges[e].next) {
            int u = edges[e].to;
            if (u != p) {
                depth[u] = depth[v] + 1;
                top++;
                stk[top] = u; sparent[top] = v;
            }
        }
    }
}

void preprocess(int root) {
    dfs(root);
}

int lca(int u, int v) {
    if (depth[u] < depth[v]) { int t = u; u = v; v = t; }

    int diff = depth[u] - depth[v];
    for (int k = 0; k < LOG; k++)
        if ((diff >> k) & 1) u = up[u][k];

    if (u == v) return u;

    for (int k = LOG - 1; k >= 0; k--) {
        if (up[u][k] != up[v][k]) {
            u = up[u][k];
            v = up[v][k];
        }
    }
    return up[u][0];
}`,
    keywords: ['lowest common ancestor', 'binary lifting', 'sparse table'],
    testCases: [
      {
        name: "기본 트리 LCA",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(1,0);\n    addEdge(0,2); addEdge(2,0);\n    addEdge(1,3); addEdge(3,1);\n    addEdge(1,4); addEdge(4,1);\n    addEdge(2,5); addEdge(5,2);\n    preprocess(0);\n    printf("%d\\n", lca(3, 4));\n    printf("%d\\n", lca(3, 5));\n    printf("%d\\n", lca(4, 5));\n    return 0;\n}`,
        expected: "1\n0\n0\n"
      },
      {
        name: "직선 트리",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    for (int i = 0; i < 4; i++) { addEdge(i, i+1); addEdge(i+1, i); }\n    preprocess(0);\n    printf("%d\\n", lca(0, 4));\n    printf("%d\\n", lca(2, 4));\n    printf("%d\\n", lca(3, 3));\n    return 0;\n}`,
        expected: "0\n2\n3\n"
      }
    ]
  },
  {
    id: 'fenwick_tree',
    name: 'Fenwick Tree (BIT)',
    category: 'Data Structure',
    difficulty: 3,
    description: 'Binary Indexed Tree. 점 업데이트 + 구간 합 쿼리 O(log n).',
    skeleton: `// Fenwick Tree / BIT (No STL)
// update(i, val): a[i] += val
// query(i): sum of a[1..i]
// rangeQuery(l, r): sum of a[l..r]

const int MAXN = 100001;

struct BIT {
    long long tree[MAXN];
    int n;

    void init(int _n) {
        n = _n;
        // TODO: 초기화
    }

    void update(int i, long long val) {
        // TODO: 구현
    }

    long long query(int i) {
        // TODO: prefix sum
        return 0;
    }

    long long rangeQuery(int l, int r) {
        // TODO
        return 0;
    }
};`,
    solution: `const int MAXN = 100001;

struct BIT {
    long long tree[MAXN];
    int n;

    void init(int _n) {
        n = _n;
        for (int i = 0; i <= n; i++) tree[i] = 0;
    }

    void update(int i, long long val) {
        for (; i <= n; i += i & (-i))
            tree[i] += val;
    }

    long long query(int i) {
        long long sum = 0;
        for (; i > 0; i -= i & (-i))
            sum += tree[i];
        return sum;
    }

    long long rangeQuery(int l, int r) {
        return query(r) - query(l - 1);
    }
};`,
    keywords: ['BIT', 'binary indexed tree', 'prefix sum', 'point update'],
    testCases: [
      {
        name: "점 업데이트 + 구간 쿼리",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    BIT bit;\n    bit.init(5);\n    bit.update(1, 3); bit.update(2, 5); bit.update(3, 7); bit.update(4, 1); bit.update(5, 4);\n    printf("%lld\\n", bit.query(5));\n    printf("%lld\\n", bit.query(3));\n    printf("%lld\\n", bit.rangeQuery(2, 4));\n    bit.update(3, -2);\n    printf("%lld\\n", bit.rangeQuery(1, 5));\n    return 0;\n}`,
        expected: "20\n15\n13\n18\n"
      },
      {
        name: "단일 원소",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    BIT bit;\n    bit.init(1);\n    bit.update(1, 10);\n    printf("%lld\\n", bit.query(1));\n    printf("%lld\\n", bit.rangeQuery(1, 1));\n    return 0;\n}`,
        expected: "10\n10\n"
      }
    ]
  },
  {
    id: 'hash_map',
    name: 'Hash Map',
    category: 'Data Structure',
    difficulty: 3,
    description: '체이닝 기반 해시맵. insert, find, erase 구현.',
    skeleton: `// Hash Map with Chaining (No STL)
// insert(key, value), find(key), erase(key)

const int BUCKET = 100003; // 소수
const int POOL = 200001;

struct Node {
    int key, value;
    int next;
} pool[POOL];
int poolCnt;
int bucket[BUCKET];

void init() {
    // TODO: 초기화
}

int hashFunc(int key) {
    // TODO: 해시 함수
    return 0;
}

void insert(int key, int value) {
    // TODO
}

int find(int key) {
    // TODO: 값 반환, 없으면 -1
    return -1;
}

bool erase(int key) {
    // TODO
    return false;
}`,
    solution: `const int BUCKET = 100003;
const int POOL = 200001;

struct Node {
    int key, value;
    int next;
} pool[POOL];
int poolCnt;
int bucket[BUCKET];

void init() {
    poolCnt = 1; // 0을 null로 사용
    for (int i = 0; i < BUCKET; i++) bucket[i] = 0;
}

int hashFunc(int key) {
    // key가 음수일 수 있으므로 처리
    return ((key % BUCKET) + BUCKET) % BUCKET;
}

void insert(int key, int value) {
    int h = hashFunc(key);
    // 이미 존재하면 업데이트
    for (int i = bucket[h]; i != 0; i = pool[i].next) {
        if (pool[i].key == key) {
            pool[i].value = value;
            return;
        }
    }
    // 새 노드 추가
    pool[poolCnt].key = key;
    pool[poolCnt].value = value;
    pool[poolCnt].next = bucket[h];
    bucket[h] = poolCnt++;
}

int find(int key) {
    int h = hashFunc(key);
    for (int i = bucket[h]; i != 0; i = pool[i].next) {
        if (pool[i].key == key) return pool[i].value;
    }
    return -1;
}

bool erase(int key) {
    int h = hashFunc(key);
    int prev = 0;
    for (int i = bucket[h]; i != 0; prev = i, i = pool[i].next) {
        if (pool[i].key == key) {
            if (prev == 0) bucket[h] = pool[i].next;
            else pool[prev].next = pool[i].next;
            return true;
        }
    }
    return false;
}`,
    keywords: ['hash table', 'chaining', 'hash function'],
    testCases: [
      {
        name: "insert/find/erase",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    init();\n    insert(10, 100); insert(20, 200); insert(30, 300);\n    printf("%d\\n", find(10));\n    printf("%d\\n", find(20));\n    printf("%d\\n", find(99));\n    erase(20);\n    printf("%d\\n", find(20));\n    insert(10, 999);\n    printf("%d\\n", find(10));\n    return 0;\n}`,
        expected: "100\n200\n-1\n-1\n999\n"
      },
      {
        name: "해시 충돌 (음수키)",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    init();\n    insert(-5, 50); insert(-100003, 60);\n    printf("%d\\n", find(-5));\n    printf("%d\\n", find(-100003));\n    erase(-5);\n    printf("%d\\n", find(-5));\n    printf("%d\\n", find(-100003));\n    return 0;\n}`,
        expected: "50\n60\n-1\n60\n"
      }
    ]
  },
  {
    id: 'scc_tarjan',
    name: 'SCC (Tarjan)',
    category: 'Graph',
    difficulty: 4,
    description: "Tarjan 알고리즘으로 강결합 컴포넌트 분리.",
    skeleton: `// Strongly Connected Components - Tarjan (No STL)

const int MAXN = 100001;
const int MAXE = 200001;

struct Edge {
    int to, next;
} edges[MAXE];
int head[MAXN], edgeCnt;

int dfn[MAXN], low[MAXN], timer_;
int stk[MAXN], top_;
bool inStk[MAXN];
int comp[MAXN]; // comp[v] = SCC 번호
int sccCnt;

void initGraph() {
    // TODO
}

void addEdge(int u, int v) {
    // TODO
}

void tarjan(int u) {
    // TODO: Tarjan DFS
}

void findSCC(int n) {
    // TODO: 모든 정점에 대해 Tarjan 실행
}`,
    solution: `const int MAXN = 100001;
const int MAXE = 200001;

struct Edge {
    int to, next;
} edges[MAXE];
int head[MAXN], edgeCnt;

int dfn[MAXN], low[MAXN], timer_;
int stk[MAXN], top_;
bool inStk[MAXN];
int comp[MAXN];
int sccCnt;

void initGraph() {
    for (int i = 0; i < MAXN; i++) { head[i] = -1; dfn[i] = 0; }
    edgeCnt = 0;
    timer_ = 0;
    top_ = 0;
    sccCnt = 0;
}

void addEdge(int u, int v) {
    edges[edgeCnt] = {v, head[u]};
    head[u] = edgeCnt++;
}

void tarjan(int u) {
    dfn[u] = low[u] = ++timer_;
    stk[top_++] = u;
    inStk[u] = true;

    for (int e = head[u]; e != -1; e = edges[e].next) {
        int v = edges[e].to;
        if (!dfn[v]) {
            tarjan(v);
            if (low[v] < low[u]) low[u] = low[v];
        } else if (inStk[v]) {
            if (dfn[v] < low[u]) low[u] = dfn[v];
        }
    }

    if (dfn[u] == low[u]) {
        sccCnt++;
        int v;
        do {
            v = stk[--top_];
            inStk[v] = false;
            comp[v] = sccCnt;
        } while (v != u);
    }
}

void findSCC(int n) {
    for (int i = 0; i < n; i++) {
        if (!dfn[i]) tarjan(i);
    }
}`,
    keywords: ['strongly connected components', 'Tarjan', 'DFS', 'low-link'],
    testCases: [
      {
        name: "기본 SCC",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(1,2); addEdge(2,0); addEdge(2,3);\n    findSCC(4);\n    printf("%d\\n", sccCnt);\n    printf("%d\\n", comp[0] == comp[1] && comp[1] == comp[2]);\n    printf("%d\\n", comp[3] != comp[0]);\n    return 0;\n}`,
        expected: "2\n1\n1\n"
      },
      {
        name: "각 정점이 별도 SCC",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(1,2);\n    findSCC(3);\n    printf("%d\\n", sccCnt);\n    return 0;\n}`,
        expected: "3\n"
      },
      {
        name: "두 개의 사이클",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    initGraph();\n    addEdge(0,1); addEdge(1,0);\n    addEdge(2,3); addEdge(3,2);\n    addEdge(1,2);\n    findSCC(4);\n    printf("%d\\n", sccCnt);\n    printf("%d\\n", comp[0] == comp[1]);\n    printf("%d\\n", comp[2] == comp[3]);\n    printf("%d\\n", comp[0] != comp[2]);\n    return 0;\n}`,
        expected: "2\n1\n1\n1\n"
      }
    ]
  },
  {
    id: 'convex_hull',
    name: 'Convex Hull (Graham Scan)',
    category: 'Geometry',
    difficulty: 3,
    description: 'Graham Scan으로 볼록 껍질 구하기. O(n log n)',
    skeleton: `// Convex Hull - Graham Scan (No STL)
// 점 집합의 볼록 껍질을 구하시오.

const int MAXN = 100001;

struct Point {
    long long x, y;
};

Point pts[MAXN];
Point hull[MAXN];
int n, hullSz;

long long cross(Point O, Point A, Point B) {
    // TODO: 외적 (OA x OB)
    return 0;
}

void swap(Point &a, Point &b) {
    Point t = a; a = b; b = t;
}

void sortPoints() {
    // TODO: 기준점 선택 후 각도 정렬 (직접 정렬 구현!)
}

void grahamScan() {
    // TODO: 볼록 껍질 구하기
}`,
    solution: `const int MAXN = 100001;

struct Point {
    long long x, y;
};

Point pts[MAXN], tmp_pts[MAXN];
Point hull[MAXN];
int n, hullSz;

long long cross(Point O, Point A, Point B) {
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

void swapP(Point &a, Point &b) {
    Point t = a; a = b; b = t;
}

// 기준점 pts[0] 기준 각도 비교
Point pivot;
bool cmp(Point &a, Point &b) {
    long long v = cross(pivot, a, b);
    if (v != 0) return v > 0;
    // 같은 각도면 거리순
    long long da = (a.x - pivot.x) * (a.x - pivot.x) + (a.y - pivot.y) * (a.y - pivot.y);
    long long db = (b.x - pivot.x) * (b.x - pivot.x) + (b.y - pivot.y) * (b.y - pivot.y);
    return da < db;
}

void msort(int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    msort(l, m);
    msort(m + 1, r);
    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r) {
        if (cmp(pts[i], pts[j])) tmp_pts[k++] = pts[i++];
        else tmp_pts[k++] = pts[j++];
    }
    while (i <= m) tmp_pts[k++] = pts[i++];
    while (j <= r) tmp_pts[k++] = pts[j++];
    for (int t = l; t <= r; t++) pts[t] = tmp_pts[t];
}

void sortPoints() {
    // 최하단-좌측 점을 pts[0]으로
    int idx = 0;
    for (int i = 1; i < n; i++) {
        if (pts[i].y < pts[idx].y ||
            (pts[i].y == pts[idx].y && pts[i].x < pts[idx].x))
            idx = i;
    }
    swapP(pts[0], pts[idx]);
    pivot = pts[0];
    msort(1, n - 1);
}

void grahamScan() {
    if (n < 3) {
        for (int i = 0; i < n; i++) hull[i] = pts[i];
        hullSz = n;
        return;
    }
    sortPoints();
    hullSz = 0;
    hull[hullSz++] = pts[0];
    hull[hullSz++] = pts[1];

    for (int i = 2; i < n; i++) {
        while (hullSz >= 2 &&
               cross(hull[hullSz - 2], hull[hullSz - 1], pts[i]) <= 0)
            hullSz--;
        hull[hullSz++] = pts[i];
    }
}`,
    keywords: ['convex hull', 'Graham scan', 'cross product', 'geometry'],
    testCases: [
      {
        name: "사각형 볼록 껍질",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 5;\n    pts[0] = {0,0}; pts[1] = {2,0}; pts[2] = {2,2}; pts[3] = {0,2}; pts[4] = {1,1};\n    grahamScan();\n    printf("%d\\n", hullSz);\n    return 0;\n}`,
        expected: "4\n"
      },
      {
        name: "삼각형",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 3;\n    pts[0] = {0,0}; pts[1] = {5,0}; pts[2] = {0,5};\n    grahamScan();\n    printf("%d\\n", hullSz);\n    return 0;\n}`,
        expected: "3\n"
      },
      {
        name: "일직선 점들",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 3;\n    pts[0] = {0,0}; pts[1] = {1,0}; pts[2] = {2,0};\n    grahamScan();\n    printf("%d\\n", hullSz);\n    return 0;\n}`,
        expected: "2\n"
      }
    ]
  },
  {
    id: 'trie',
    name: 'Trie',
    category: 'Data Structure',
    difficulty: 3,
    description: '문자열 트라이. 삽입, 검색, 접두사 검색.',
    skeleton: `// Trie (No STL)
// insert(word), search(word), startsWith(prefix)

const int MAXNODE = 1000001;
const int ALPHA = 26;

struct Trie {
    int ch[MAXNODE][ALPHA];
    bool isEnd[MAXNODE];
    int cnt; // 노드 수

    void init() {
        // TODO: 초기화
    }

    void insert(const char* word) {
        // TODO
    }

    bool search(const char* word) {
        // TODO
        return false;
    }

    bool startsWith(const char* prefix) {
        // TODO
        return false;
    }
};`,
    solution: `const int MAXNODE = 1000001;
const int ALPHA = 26;

struct Trie {
    int ch[MAXNODE][ALPHA];
    bool isEnd[MAXNODE];
    int cnt;

    void init() {
        cnt = 1; // 0번 = 루트
        for (int j = 0; j < ALPHA; j++) ch[0][j] = 0;
        isEnd[0] = false;
    }

    void insert(const char* word) {
        int cur = 0;
        for (int i = 0; word[i]; i++) {
            int c = word[i] - 'a';
            if (!ch[cur][c]) {
                ch[cur][c] = cnt;
                for (int j = 0; j < ALPHA; j++) ch[cnt][j] = 0;
                isEnd[cnt] = false;
                cnt++;
            }
            cur = ch[cur][c];
        }
        isEnd[cur] = true;
    }

    bool search(const char* word) {
        int cur = 0;
        for (int i = 0; word[i]; i++) {
            int c = word[i] - 'a';
            if (!ch[cur][c]) return false;
            cur = ch[cur][c];
        }
        return isEnd[cur];
    }

    bool startsWith(const char* prefix) {
        int cur = 0;
        for (int i = 0; prefix[i]; i++) {
            int c = prefix[i] - 'a';
            if (!ch[cur][c]) return false;
            cur = ch[cur][c];
        }
        return true;
    }
};`,
    keywords: ['trie', 'prefix tree', 'string'],
    testCases: [
      {
        name: "insert/search/startsWith",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    Trie t;\n    t.init();\n    t.insert("apple");\n    t.insert("app");\n    printf("%d\\n", t.search("apple"));\n    printf("%d\\n", t.search("app"));\n    printf("%d\\n", t.search("ap"));\n    printf("%d\\n", t.startsWith("ap"));\n    printf("%d\\n", t.startsWith("b"));\n    return 0;\n}`,
        expected: "1\n1\n0\n1\n0\n"
      },
      {
        name: "빈 트라이 검색",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    Trie t;\n    t.init();\n    printf("%d\\n", t.search("abc"));\n    printf("%d\\n", t.startsWith(""));\n    t.insert("hello");\n    printf("%d\\n", t.search("hello"));\n    printf("%d\\n", t.search("hell"));\n    return 0;\n}`,
        expected: "0\n1\n1\n0\n"
      }
    ]
  },
  {
    id: 'network_flow',
    name: 'Max Flow (Dinic)',
    category: 'Graph',
    difficulty: 5,
    description: "Dinic 알고리즘으로 최대 유량. O(V²E)",
    skeleton: `// Dinic's Max Flow (No STL)

const int MAXN = 1001;
const int MAXE = 20001;
const int INF = 0x3f3f3f3f;

struct Edge {
    int to, cap, next;
} edges[MAXE * 2]; // 정방향 + 역방향
int head[MAXN], edgeCnt;

int level[MAXN]; // BFS 레벨
int iter[MAXN];  // current arc
int que[MAXN];

void init(int n) {
    // TODO
}

void addEdge(int u, int v, int cap) {
    // TODO: 정방향 + 역방향 간선 추가
}

bool bfs(int s, int t) {
    // TODO: 레벨 그래프 구성
    return false;
}

int dfs(int v, int t, int f) {
    // TODO: blocking flow
    return 0;
}

int maxFlow(int s, int t) {
    // TODO: Dinic 메인
    return 0;
}`,
    solution: `const int MAXN = 1001;
const int MAXE = 20001;
const int INF = 0x3f3f3f3f;

struct Edge {
    int to, cap, next;
} edges[MAXE * 2];
int head[MAXN], edgeCnt;

int level[MAXN];
int iter[MAXN];
int que[MAXN];

void init(int n) {
    for (int i = 0; i < n; i++) head[i] = -1;
    edgeCnt = 0;
}

void addEdge(int u, int v, int cap) {
    edges[edgeCnt] = {v, cap, head[u]};
    head[u] = edgeCnt++;
    edges[edgeCnt] = {u, 0, head[v]};  // 역방향 (용량 0)
    head[v] = edgeCnt++;
}

bool bfs(int s, int t) {
    for (int i = 0; i < MAXN; i++) level[i] = -1;
    int qf = 0, qr = 0;
    level[s] = 0;
    que[qr++] = s;
    while (qf < qr) {
        int v = que[qf++];
        for (int e = head[v]; e != -1; e = edges[e].next) {
            if (edges[e].cap > 0 && level[edges[e].to] < 0) {
                level[edges[e].to] = level[v] + 1;
                que[qr++] = edges[e].to;
            }
        }
    }
    return level[t] >= 0;
}

int dfs(int v, int t, int f) {
    if (v == t) return f;
    for (int &e = iter[v]; e != -1; e = edges[e].next) {
        int to = edges[e].to;
        if (edges[e].cap > 0 && level[to] == level[v] + 1) {
            int d = dfs(to, t, f < edges[e].cap ? f : edges[e].cap);
            if (d > 0) {
                edges[e].cap -= d;
                edges[e ^ 1].cap += d; // 역방향 갱신
                return d;
            }
        }
    }
    return 0;
}

int maxFlow(int s, int t) {
    int flow = 0;
    while (bfs(s, t)) {
        for (int i = 0; i < MAXN; i++) iter[i] = head[i];
        int d;
        while ((d = dfs(s, t, INF)) > 0)
            flow += d;
    }
    return flow;
}`,
    keywords: ['max flow', 'Dinic', 'level graph', 'blocking flow'],
    testCases: [
      {
        name: "기본 유량",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    init(4);\n    addEdge(0,1,10); addEdge(0,2,10);\n    addEdge(1,3,10); addEdge(2,3,10);\n    addEdge(1,2,1);\n    printf("%d\\n", maxFlow(0, 3));\n    return 0;\n}`,
        expected: "20\n"
      },
      {
        name: "병목 간선",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    init(3);\n    addEdge(0,1,100); addEdge(1,2,1);\n    printf("%d\\n", maxFlow(0, 2));\n    return 0;\n}`,
        expected: "1\n"
      },
      {
        name: "병렬 경로",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    init(2);\n    addEdge(0,1,3); addEdge(0,1,4);\n    printf("%d\\n", maxFlow(0, 1));\n    return 0;\n}`,
        expected: "7\n"
      }
    ]
  },
  {
    id: 'knuth_optimization',
    name: 'Knuth Optimization DP',
    category: 'DP',
    difficulty: 5,
    description: 'Knuth 최적화로 구간 DP를 O(n²)에 해결.',
    skeleton: `// Knuth Optimization (No STL)
// 최적 이진 탐색 트리 / 행렬 체인 곱셈 등
// dp[i][j] = min cost to merge interval [i, j]
// opt[i][j] = optimal split point

const int MAXN = 5001;
typedef long long ll;

ll dp[MAXN][MAXN];
int opt[MAXN][MAXN];
ll cost[MAXN][MAXN]; // cost(i,j) 또는 prefix sum 기반
ll prefix[MAXN];
int n;

void solve() {
    // TODO: Knuth 최적화 DP 구현
    // 핵심: opt[i][j-1] <= opt[i][j] <= opt[i+1][j]
}`,
    solution: `const int MAXN = 5001;
typedef long long ll;

ll dp[MAXN][MAXN];
int opt[MAXN][MAXN];
ll prefix[MAXN]; // prefix[i] = a[0] + ... + a[i-1]
int n;

// cost(i, j) = 구간 [i, j]의 합 (파일 합치기 등)
ll cost(int i, int j) {
    return prefix[j + 1] - prefix[i];
}

void solve() {
    // dp[i][i] = 0, opt[i][i] = i
    for (int i = 0; i < n; i++) {
        dp[i][i] = 0;
        opt[i][i] = i;
    }

    // 구간 길이 len = 1부터 n-1까지
    for (int len = 1; len < n; len++) {
        for (int i = 0; i + len < n; i++) {
            int j = i + len;
            dp[i][j] = (ll)1e18;

            int lo = opt[i][j - 1];
            int hi = opt[i + 1][j];

            for (int k = lo; k <= hi; k++) {
                ll val = dp[i][k] + dp[k + 1][j] + cost(i, j);
                if (val < dp[i][j]) {
                    dp[i][j] = val;
                    opt[i][j] = k;
                }
            }
        }
    }
}`,
    keywords: ['Knuth optimization', 'interval DP', 'optimal BST', 'monotone condition'],
    testCases: [
      {
        name: "파일 합치기 (4개)",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 4;\n    int a[] = {10, 20, 30, 40};\n    prefix[0] = 0;\n    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + a[i];\n    solve();\n    printf("%lld\\n", dp[0][3]);\n    return 0;\n}`,
        expected: "170\n"
      },
      {
        name: "파일 합치기 (2개)",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 2;\n    int a[] = {5, 10};\n    prefix[0] = 0;\n    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + a[i];\n    solve();\n    printf("%lld\\n", dp[0][1]);\n    return 0;\n}`,
        expected: "15\n"
      },
      {
        name: "동일 크기 파일 3개",
        harness: `#include <cstdio>\n%USER_CODE%\nint main() {\n    n = 3;\n    int a[] = {10, 10, 10};\n    prefix[0] = 0;\n    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + a[i];\n    solve();\n    printf("%lld\\n", dp[0][2]);\n    return 0;\n}`,
        expected: "50\n"
      }
    ]
  }
];

const CATEGORIES = [...new Set(ALGORITHMS.map(a => a.category))];

if (typeof module !== 'undefined') module.exports = { ALGORITHMS, CATEGORIES };
