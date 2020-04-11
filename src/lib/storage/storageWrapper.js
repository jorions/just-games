// In private browsing, iOS Safari disables localStorage saving. So we need
// to account for this. Code used from https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/
let inMemoryStorage = {}

let localStorageEnabled
try {
  const mod = '__storage_test__'
  localStorage.setItem(mod, mod)
  localStorage.removeItem(mod)
  localStorageEnabled = true
} catch (e) {
  localStorageEnabled = false
}

export const set = (key, value) => {
  if (localStorageEnabled) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    inMemoryStorage[key] = JSON.stringify(value)
  }
}

export const get = key => {
  const data = localStorageEnabled ? localStorage.getItem(key) : inMemoryStorage[key]
  return data ? JSON.parse(data) : null
}

export const remove = key => {
  if (localStorageEnabled) {
    localStorage.removeItem(key)
  } else {
    delete inMemoryStorage[key]
  }
}

export const clear = () => {
  if (localStorageEnabled) {
    localStorage.clear()
  } else {
    inMemoryStorage = {}
  }
}
