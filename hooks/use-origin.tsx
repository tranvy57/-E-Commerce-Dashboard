import { useEffect, useState } from 'react'

// trả về giá trị của origin (gốc) của trang web, tức là phần đầu của URL,
//bao gồm giao thức (http hoặc https), tên miền và cổng nếu có

export const useOrigin = () => {
	const [mounted, setMounted] = useState(false)
	const origin =
		typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return ''
	}

	return origin
}
