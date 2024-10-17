import { vite } from '@darkobits/ts'

export default vite.node({
  test: {
    coverage: {
      exclude: [
        '**/etc/types'
      ]
    }
  }
})