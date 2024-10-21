'use client'
import { arrangeSidebarData } from '@/src/utils/common'
import { Layout, Menu } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import React, { Children } from 'react'
import { LuLayoutDashboard } from 'react-icons/lu'

export default function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {  
    const [selectedMenu, setSelectedMenu] = React.useState(['1'])
    const sidebarClick = (e: any) => {
        setSelectedMenu([e.key
        ]) // Update selectedMenu state
    }
    const sidebarItems = [
        {
            key: '1',
            name: 'Dashboard',
            icon: (<LuLayoutDashboard width={20} fontSize={20} className=" !text-base" />),
            slink: 'dashboard',
        },
        {
            key: '2',
            name: 'Catalog',
            icon: (<LuLayoutDashboard width={20} fontSize={20} className=" !text-base" />),
            slink: 'catalog',
        },

    ]
    const items = arrangeSidebarData(sidebarItems);

    return (
        <Layout className='h-screen'>
            <Sider className=' h-screen'>
                <div>
                    <div className='text-center text-xl font-bold p-4'>Welcome</div>
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={selectedMenu} // Use selectedKeys instead of defaultSelectedKeys
                    mode="inline"
                    items={items}
                    onClick={sidebarClick}
                />
            </Sider>
            <Content className='bg-slate-800'>
                {children}
            </Content>
        </Layout>
    )
}