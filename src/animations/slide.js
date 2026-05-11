export const slideInLeft = {
  initial:   { opacity: 0, x: -24 },
  animate:   { opacity: 1, x: 0   },
  exit:      { opacity: 0, x: -24 },
  transition:{ duration: 0.2 },
}

export const slideInRight = {
  initial:   { opacity: 0, x: 24 },
  animate:   { opacity: 1, x: 0  },
  exit:      { opacity: 0, x: 24 },
  transition:{ duration: 0.2 },
}