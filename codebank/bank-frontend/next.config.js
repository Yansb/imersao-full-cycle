/** @type {import('next').NextConfig} */

module.exports = {
  distDir: process.env.NODE_ENV === 'development' ? `.nest-${process.env.NEXT_PUBLIC_BANK_CODE}` : '.nest',
  reactStrictMode: true,

  async redirects(){
    return [
      {
        source: '/',
        destination: '/bank-accounts',
        permanent: true
      }
    ]
  }
}
