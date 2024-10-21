'use client';
import { useState, Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link'
import type { MenuProps } from 'antd';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import Image from 'next/image'
import { BiArrowBack } from 'react-icons/bi';
// Utility Functions
const Utils = {
	getNameInitial: (name: string) => {
		let initials = name.match(/\b\w/g) || [];
		return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
	},
};
type MenuItem = Required<MenuProps>['items'][number];

export function decodeHtmlEntities(encodedString: string) {
	const parser = new DOMParser();
	const decodedText = parser.parseFromString(encodedString, 'text/html').body.textContent;
	return decodedText;
}
function extractParams(url: string, excludeParams: any[]) {
	try {
	  // Decode HTML entities in the URL
	  const decodedUrl:any = decodeHtmlEntities(url);

	  // Create a URL object
	  const urlObj = new URL(decodedUrl);

	  // Get the query parameters
	  const params = new URLSearchParams(urlObj.search);

	  // Remove the specified parameters
	  excludeParams.forEach(param => params.delete(param));

	  // Reconstruct the query string without the excluded parameters
	  const queryString = params.toString();

	  // Get the hash part
	  const hashString = urlObj.hash.replace('#', '&#');

	  // Return only the hash part
	  const result = `${hashString}${queryString ? '&' + queryString : ''}`;
	  return result;
	} catch (error) {
	  return '';
	}
  }


export const arrangeSidebarData = (data: Array<any>) => {

	function getItem(
		label: React.ReactNode,
		href: string,
		key: React.Key,
		icon?: any,
		children?: MenuItem[],
		type?: string,
		slink?: string,
		video_popup?: string
	): MenuItem {
		const [section = 'common', subSection = "dashboard"] = video_popup?.split(".") || [];

		// let iconWithoutDash = icon ? icon?.replace('-', '') : '';
		const iconSvg = icon ? icon : null;
		// const iconSvg = icon ? <Image width={100} height={100} className="w-4" src={dashboardIcons?.[iconWithoutDash]?.src} alt={`icon-${icon}.svg`} /> : null;
		const childManage = children && children?.length > 0 ? children : null;
		const parentLink = children && children?.length > 0 ? null : href;
		const menuLabel = (children && children?.length > 0) ? label : slink ? <Link href={`${slink}`} >{label}</ Link> : <a href={url(extractRoute(href), extractParams(href, ['route', 'user_token']) )}>{label}</a>;
		const mainLink = (
			<div className={'flex justify-between items-center pr-4'}>
				{menuLabel}
			</div>
		)

		if (parentLink) {

		}
		return {
			id: key,
			key,
			icon: iconSvg,
			children: childManage,
			label: mainLink,
			// type: type,
		} as MenuItem;
	}

	function firstLetterToLowerCase(str: string) {
		return str?.charAt(0)?.toLowerCase() + str?.substring(1);
	}

	const genrateId = (id: string, name: string, join: string) => {
		if (id) {
			return id;
		} else {
			return `${join}-${firstLetterToLowerCase(name)}`
		}

	}

	if(!Array.isArray(data)) {
		console.log('arrangeSidebarData: data is not an array', data);
		return [];
	}

	const items: MenuItem[] = data?.map((item: any, index: any) => {
		const { id, name, icon, children, href, link, slink, video_popup } = item;
		const linkParent = children && children?.length > 0 ? null : href;
		var childArray: any = [];
		if (children?.length > 0) {
			children?.map((child: any, i: any) => {
				let itemChildren: Array<any> = child?.children?.length > 0 ? [] : child?.children;

				if (child?.children?.length > 0) {
					child?.children?.map((itemChild: any, i: number) => {
						itemChildren.push(getItem(<> <div className='menu-arrowed flex '><MdKeyboardDoubleArrowRight className='mr-2' /> {itemChild.name}</div> </>, itemChild.href, genrateId(itemChild?.id, itemChild?.name, 'c'), '', itemChild.children, '', itemChild.slink, itemChild.video_popup));
					})
				}
				if (itemChildren?.length > 0) {
					childArray.push(getItem(child?.name, child.href, genrateId(child?.id, child?.name, 'f'), 'arrowMenu', itemChildren, 'group', child.video_popup));
				} else {
					childArray.push(getItem(<> <div className='menu-arrowed flex '><MdKeyboardDoubleArrowRight className='mr-2' /> {child.name}</div> </>, child.href, genrateId(child?.id, child?.name, 'f'), '', itemChildren, '', child.slink, child.video_popup));
				}

				// childArray.push(getItem(<> <div className='menu-arrowed flex '><MdKeyboardDoubleArrowRight className='mr-2' /> {child.name}</div> </>, child.href, genrateId(child?.id, child?.name, 'f'), '', [], '', child.slink));

			});
		}
		return getItem(name, linkParent, id, icon, childArray, 'group', slink, video_popup);
	});

	return items;
}

function makeRoute(urlString: string) {
	let result = urlString.match(/\.com(.*?)\?/);

	// Check if a match is found
	if (result && result[1]) {
		let extractedString = result[1];
		return extractedString;
	} else {

	}

}

export const url = (route: any, params='') => `/admin/?route=${route}`;
function isURL(str: string) {
	// Regular expression to match URLs
	var urlPattern = /^(?:https?|ftp):\/\/(?:\w+:{0,1}\w*@)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}(?:\/[-\w:@&?+=,.!\/~%#]*)?$/;

	return urlPattern.test(str);
}
function extractRoute(url: string) {
	if (url) {
		const params = new URLSearchParams(new URL(url).search);
		const routeValue = params.get('route');
		return routeValue;
	}
}


const sidebarChildren = (data: Array<any>, id: string) => {
	let childrenArry: Array<any> = [];
	let childrenData: any = findDataById(id)?.children

	data?.map((item, index) => {
		if (typeof item === 'object' && !Array.isArray(item)) {
			const findData = childrenData?.find((child: any) => child.id === item.id)
			const transformedItem: any = {
				key: `${id}-${item?.name}`,
				type: '1', // we will remove this key after research.
				label: findDataById(id)?.childRoutStatus && findDataById(id)?.childRoute?.find((child: any) => child.id === item.id) ? <Link href={{ pathname: makeRoute(item?.href) }}>{item.name}</Link> : <a href={url(extractRoute(item.href))}>{item.name}</a>,
				icon: <Image width={10} height={10} className="w-2" src={''} alt={item?.name} />,
				// search: true,
				// searchValues: {
				// 	text: item?.name,
				// 	url: item?.name && `/admin/${item?.slink}`,
				// }

			}

			if (item?.slink) {
				transformedItem.search = true;
				transformedItem.searchValues = {
					text: item?.name,
					url: item?.slink && `/admin/${item?.slink}`,
				};
			}

			if (item?.children && Array.isArray(item?.children) && item?.children?.length > 0) {
				transformedItem.children = item?.children;
			}

			childrenArry.push(transformedItem)
		}

	});
	return childrenArry;
}
function findDataById(id: string) {
	const foundData: any = staticData?.find(item => item?.id === id);
	return foundData || null; // Return null if no matching item is found
}
const staticData = [
	{
		id: 'menu-dashboard',
		type: '1',
	},
	{
		id: 'menu-catalog',
		type: '1',
		childRoutStatus: true,
		childRoute: [{ id: 'f-categories' }, { id: 'f-products' }, { id: 'f-recurring Profiles' }, { id: 'f-filters' }, { id: 'f-attributes' }, { id: 'f-options' }, { id: 'f-manufacturers' }, { id: 'f-downloads' }, { id: 'f-reviews' }, { id: 'f-pages' }]
	},
	{
		id: 'menu-sale',
		type: '1',
		childRoutStatus: true,
		childRoute: [{ id: 'f-orders' }, { id: 'f-missing Orders' }, { id: 'f-recurring Orders' }, { id: 'f-returns' }, { id: 'f-export Orders' }, { id: 'ff-gift Vouchers' }]
	},
	{
		id: 'menu-customer',
		type: '1',

	},
	{
		id: 'menu-apps',
		type: '1',
	},
	{
		id: 'menu-digital-services',
		type: '1',

	},
	{
		id: 'journal3-theme',
		type: '1',
		childRoutStatus: true,
		childRoute: [{ id: 'fvariables' }, { id: 'fstyles' }, { id: 'fskin' }, { id: 'fheader' }, { id: 'ffooter' }, { id: 'flayout' }, { id: 'fmodules' }, { id: 'fproduct' }]
	},
	{
		id: 'menu-extension',
		type: '1',
	},
	{
		id: 'menu-design',
		icon: 'design',
		type: '1',
	},
	{
		id: 'blog',
		type: '1',
		childRoutStatus: true,
		childRoute: [{ id: 'blog_setting' }, { id: 'blog_category' }, { id: 'blog_post' }, { id: 'blog_comment' }]
	},
	{
		id: 'menu-contact',
		type: '1',
		localrout: true,
	},
	{
		id: 'menu-marketing',
		type: '1'
	},
	{
		id: 'menu-system',
		type: '1'

	},
	{
		id: 'menu-report',
		type: '1',

	},
	{
		id: 'menu-fatherpay',
		type: '1'
	}
]