export const RETRY_GAP = 2
export const CONFIRM_GAP = 4

// Her kart kuyrukta { id, stage } olarak durur.
// stage: 'new' (ilk kez), 'retry' (yanlıştan sonra), 'confirm' (pekiştirme)
export function createQueue(ids) {
  return ids.map((id) => ({ id, stage: 'new' }))
}

function insertAt(queue, entry, gap) {
  const pos = Math.min(gap, queue.length)
  return [...queue.slice(0, pos), entry, ...queue.slice(pos)]
}

// Kuyruğun başındaki kartı cevaplar.
// Dönen değer: yeni kuyruk, kartın cevaplanmadan önceki aşaması,
// kartın tamamlanıp tamamlanmadığı ve ilk denemede doğru olup olmadığı.
export function answerCurrent(queue, isCorrect) {
  const [current, ...rest] = queue
  if (!current) {
    return { queue, stage: null, completed: false, firstTry: false }
  }
  const { id, stage } = current

  if (!isCorrect) {
    return {
      queue: insertAt(rest, { id, stage: 'retry' }, RETRY_GAP),
      stage,
      completed: false,
      firstTry: false,
    }
  }
  if (stage === 'retry') {
    return {
      queue: insertAt(rest, { id, stage: 'confirm' }, CONFIRM_GAP),
      stage,
      completed: false,
      firstTry: false,
    }
  }
  return {
    queue: rest,
    stage,
    completed: true,
    firstTry: stage === 'new',
  }
}