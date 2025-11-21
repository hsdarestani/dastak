document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('demo-form')
  const hint = document.getElementById('form-hint')
  const navLinks = document.querySelectorAll('a[href^="#"]')

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href').substring(1)
      const target = document.getElementById(targetId)
      if (target) {
        event.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })

  form?.addEventListener('submit', event => {
    event.preventDefault()
    const data = new FormData(form)
    const payload = Object.fromEntries(data.entries())

    hint.textContent = 'ممنون! به‌زودی با کلیدهای API و راهنمای راه‌اندازی با شما تماس می‌گیریم.'
    hint.style.color = '#5ee8b0'

    console.table(payload)
  })
})
