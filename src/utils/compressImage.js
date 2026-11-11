const MAX_DIMENSION = 800
const MAX_DATA_URL_SIZE = 100 * 1024
const DEFAULT_QUALITY = 0.7
const MIN_QUALITY = 0.4
const QUALITY_STEP = 0.1

function loadImage(fileUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Не вдалося завантажити зображення'))
    image.src = fileUrl
  })
}

function getCanvasSize(width, height) {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

function renderImage(canvas, image, width, height, quality) {
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Браузер не підтримує обробку зображень')
  }

  context.clearRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}

export async function compressImage(file) {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Будь ласка, виберіть файл зображення')
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(objectUrl)
    const { width, height } = getCanvasSize(image.naturalWidth, image.naturalHeight)
    const canvas = document.createElement('canvas')
    let quality = DEFAULT_QUALITY
    let currentWidth = width
    let currentHeight = height
    let dataUrl = renderImage(canvas, image, currentWidth, currentHeight, quality)

    while (dataUrl.length > MAX_DATA_URL_SIZE && quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP)
      dataUrl = renderImage(canvas, image, currentWidth, currentHeight, quality)
    }

    while (dataUrl.length > MAX_DATA_URL_SIZE && Math.max(currentWidth, currentHeight) > 320) {
      currentWidth = Math.max(1, Math.round(currentWidth * 0.8))
      currentHeight = Math.max(1, Math.round(currentHeight * 0.8))
      dataUrl = renderImage(canvas, image, currentWidth, currentHeight, MIN_QUALITY)
    }

    if (dataUrl.length > MAX_DATA_URL_SIZE) {
      throw new Error('Не вдалося стиснути зображення до допустимого розміру')
    }

    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
