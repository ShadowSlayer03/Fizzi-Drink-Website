import React from 'react'
import FizziLogo from './FizziLogo'
import clsx from 'clsx'

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className='flex justify-center py-4 -mb-28'>
      <FizziLogo className={clsx('h-20 z-10 cursor-pointer', className)} />
    </header>
  )
}