'use client'
import * as z from 'zod'
import { useState } from 'react'
import { Store } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { AlertModal } from '@/components/modals/alert-modal'
import { ApiAlert } from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'

interface SettingsFormDrops {
	initialData: Store
}

const formSchema = z.object({
	name: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>

export const SettingsForm: React.FC<SettingsFormDrops> = ({ initialData }) => {
	const params = useParams() // use Params để lấy các tham số từ đường dẫn URL
	const router = useRouter() //get router
	const origin = useOrigin()

	const [open, setOpen] = useState(false) //alertModal
	const [loading, setLoading] = useState(false)

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(formSchema),
		// zodResolver để xác thực biểu mẫu dựa trên schema được định nghĩa trước đó
		defaultValues: initialData,
		// Đặt giá trị mặc định cho biểu mẫu
	})

	const onSubmit = async (data: SettingsFormValues) => {
		try {
			console.log(data)

			setLoading(true)
			await axios.patch(`/api/stores/${params.storeId}`, data)
			// .patch() là một phương thức của nó được sử dụng để thực hiện yêu cầu HTTP loại PATCH.
			//data: chứa dữ liệu cần được gửi lên server để thực hiện thao tác cập nhật.
			router.refresh()
			toast.success('Store updated.')
		} catch (error) {
			toast.error('Some thing went wrong')
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(`/api/stores/${params.storeId}`)
			router.refresh()
		} catch (error) {
			toast.error('Make sure you removed all products and categories first.')
		} finally {
			setLoading(false)
			setOpen(false)
			router.refresh()
			router.push('/')
			toast.success('Store deleted')
		}
	}

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading title="Settings" description="Manage store preferences" />
				<Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
					<Trash />
				</Button>
			</div>

			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder="Store name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button disabled={loading} className="ml-auto" type="submit">
						Save changes
					</Button>
				</form>
			</Form>
			<Separator />
			<ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${params.storeId}`}
				variant="public"
			/>
		</>
	)
}
