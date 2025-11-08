import React, { useState } from 'react'
import FizziWaveMenu from './FizziWaveMenu'

type Props = {}

const NavMenu = (props: Props) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setMenuOpen(true)}
                className="fixed top-6 right-6 z-[150] flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 hover:scale-110 transition-transform duration-300"
            >
                <div className="relative w-6 h-[2px] bg-white transition-all duration-300" />
                <div className="absolute w-6 h-[2px] bg-white translate-y-2 transition-all duration-300" />
            </button>

            <FizziWaveMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    )
}

export default NavMenu