import { range, shuffle } from 'lodash'

export const arr = shuffle(range(0,50))

/*
// https://en.wikipedia.org/wiki/Insertion_sort
i ← 1
while i < length(A)
    j ← i
    while j > 0 and A[j-1] > A[j]
        swap A[j] and A[j-1]
        j ← j - 1
    end while
    i ← i + 1
end while
*/

const swap = (a,b) => {
  const tmp = arr[a]
  arr[a] = arr[b]
  arr[b] = tmp
}

export const insertionSort = () => {
  let i = 0
  while (i < arr.length) {
    let j = i
    while (j > 0 && arr[j-1] > arr[j]) {
      swap(j, j - 1)
      j = j - 1
    }
    i = i + 1
  }
}

