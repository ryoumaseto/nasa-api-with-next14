/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'apod.nasa.gov',
                pathname: '/apod/image/**',
            },
            {
                protocol: 'http',
                hostname: 'mars.jpl.nasa.gov',
                pathname: '/msl-raw-images/**',
            },
            {
                protocol: 'https',
                hostname: 'epic.gsfc.nasa.gov',
                pathname: '/archive/natural/**',
            },
            {
                protocol: 'https',
                hostname: 'neo.sci.gsfc.nasa.gov',
                pathname: '/servlet/RenderData/**',
            },
            {
                protocol: 'https',
                hostname: 'www.youtube.com',
                pathname: '/embed/**',
            },
        ],
    },
}

module.exports = nextConfig