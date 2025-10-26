'use client';
import { Github } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import Image from 'next/image';
import { Button } from '@/components/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex-1">{/* Empty space for layout balance */}</div>
          <nav className="flex-1 flex justify-center">
            {/* Navigation links can be added here */}
          </nav>
          <div className="flex-1 flex gap-2 justify-end">
            <ModeToggle />
            <Button
              onClick={() =>
                router.push('https://github.com/sanjayc208/pinexio')
              }
            >
              <Github className="h-[1.2rem] w-[1.2rem] transition-all" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto flex flex-col items-center max-w-6xl"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-2 lg:gap-4 justify-center xs:px-2"
            >
              <Image
                alt="logo"
                className="h-auto w-auto dark:invert"
                width={100}
                height={100}
                src={`/logos/pinedocs.png`}
              />
              <h1 className="text-5xl content-center md:text-7xl font-stretch-110% -tracking-tighter text-gray-900 dark:text-white">
                PINE<span className="md:text-8xl">X</span>IO
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-shadow-xs mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              A customizable open-source documentation template built with
              Next.js 15, Tailwind CSS 4, and Contentlayer for beautiful, fast,
              and flexible documentation.
            </motion.p>
          </div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-row sm:flex-row gap-4 mt-8"
          >
            <Button
              className="px-6 py-3"
              variant={'primary'}
              onClick={() => router.push('/docs/getting-started/introduction')}
              size={'md'}
            >
              Get Started
            </Button>
            <Button
              className="px-6 py-3 gap-2"
              variant={'outline'}
              size={'md'}
              onClick={() =>
                router.push('https://github.com/sanjayc208/pinexio')
              }
            >
              <Github size={20} />
              GitHub
            </Button>
          </motion.div>
        </motion.div>
        <div className="mt-16 mb-6 flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {[
            {
              src: '/logos/next15.png',
              label: 'Next.js 15',
              className: 'dark:invert',
            },
            {
              src: '/logos/ts.png',
              label: 'Typescript',
              className: 'dark:invert',
            },
            {
              src: '/logos/tailwindcss-light.png',
              label: 'Tailwind CSS 4',
              className: 'dark:invert',
            },
            { src: '/logos/contentlayer.png', label: 'Contentlayer' },
            { src: '/logos/mdx.png', label: 'MDX' },
          ].map(({ src, label, className }) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              key={label}
              className="flex flex-col items-center"
            >
              <div className="w-5 h-5 md:w-12 md:h-12 flex items-center justify-center">
                <Image
                  width={100}
                  height={100}
                  src={src}
                  alt={`${label} Logo`}
                  className={className}
                />
              </div>
              <span className="mt-2 text-sm">{label}</span>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 z-10 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 text-center text-gray-600 dark:text-gray-400">
          <div className="flex justify-end items-center space-x-4">
            <Button
              className="px-4 py-2 text-sm font-medium gap-2"
              onClick={() =>
                window.open(
                  'https://vercel.com/new/clone?repository-url=https://github.com/sanjayc208/pinexio',
                  '_blank'
                )
              }
            >
              <Image
                src={'/logos/vercel.png'}
                height={'20'}
                width={'20'}
                alt={'Deploy Vercel'}
                className={'dark:invert'}
              />
              <span>Deploy to Vercel</span>
            </Button>
            <div className="flex text-sm text-right gap-3">
              <p>
                Built with ❤️ by <strong>Sanjay Rajeev</strong>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
