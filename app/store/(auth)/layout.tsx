"use client"
import React, { Children } from 'react'


export default function AuthLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
    }) {
  return (
    <div className='flex min-h-screen w-full'>
        <div className='hidden lg:flex items-center justify-center bg-black w-1/2 px-12'>
            <div className='max-w-md space-y-6 text-center text-primary-forground'>
                <h1 className='text-4xl font-bold tracking-light'>Welcome Back</h1>
            </div>
        </div>
        <div className='flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8'>
            {children}
        </div>
    </div>
  )
}
