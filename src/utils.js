import pathToRegexp from 'path-to-regexp'

const patternCache = {}
const cacheLimit = 10000
let cacheCount = 0

const compilePath = (pattern, options) => {
  const cacheKey = `${options.end}${options.strict}`
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {})

  if (cache[pattern])
    return cache[pattern]

  const keys = []
  const re = pathToRegexp(pattern, keys, options)
  const compiledPattern = { re, keys }

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern
    cacheCount++
  }

  return compiledPattern
}

/**
 * Public API for matching a URL pathname to a path pattern.
 */
export function matchPath (pathname, options = {}) {
  if (typeof options === 'string')
    options = { path: options }

  const { path = '/', exact = true, strict = false } = options
  const { re, keys } = compilePath(path, { end: exact, strict })
  const match = re.exec(pathname)

  if (!match)
    return null

  const [ url, ...values ] = match
  const isExact = pathname === url

  if (exact && !isExact)
    return null

  return {
    path, // the path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index]
      return memo
    }, {})
  }
}
export function timeAgo (date) {
  const time = (new Date(date)).getTime() / 1000;
  const between = Date.now() / 1000 - time;
  if (between < 3600) {
    return pluralize(~~(between / 60), ' 分钟前');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' 小时前');
  } else {
    return pluralize(~~(between / 86400), ' 天前');
  }
}

function pluralize (time, label) {
  return time + label;
}