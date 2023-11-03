import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-provider'
import { UserButton } from '@clerk/nextjs'
import { ToasterProvider } from '@/providers/toast-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Dashboard Admin',
	description: 'Dashboard Admin',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider
		// publishableKey={
		// 	(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY =
		// 		'pk_test_bHVja3ktZ2Vja28tMTkuY2xlcmsuYWNjb3VudHMuZGV2JA')
		// }
		>
			<html lang="en">
				<body className={inter.className}>
					<ToasterProvider />
					<ModalProvider />

					{children}
				</body>
			</html>
		</ClerkProvider>
	)
}
