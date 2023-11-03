'use client'
import * as z from 'zod'
import { useState } from 'react'
import { Billboard } from '@prisma/client'
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
import ImageUpload from '@/components/ui/image-upload'

const formSchema = z.object({
	label: z.string().min(1),
	imageUrl: z.string().min(1),
})

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormDrops {
	initialData: Billboard | null
}

export const BillboardForm: React.FC<BillboardFormDrops> = ({ initialData }) => {
	const params = useParams() // use Params để lấy các tham số từ đường dẫn URL
	const router = useRouter() //get router
	const origin = useOrigin()

	const title = initialData ? 'Edit billboard' : 'Create billboard'
	const description = initialData ? 'Edit a billboard.' : 'Add a new billboard'
	const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.'
	const action = initialData ? 'Save changes' : 'Create'

	const [open, setOpen] = useState(false) //alertModal
	const [loading, setLoading] = useState(false)

	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		// zodResolver để xác thực biểu mẫu dựa trên schema được định nghĩa trước đó
		defaultValues: initialData || {
			label: '',
			imageUrl: '',
		},

		// Đặt giá trị mặc định cho biểu mẫu
	})

	const onSubmit = async (data: BillboardFormValues) => {
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
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash />
					</Button>
				)}
			</div>

			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Background Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										//đã có một giá trị hình ảnh được chọn trước đó
										disable={loading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange('')}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input disabled={loading} placeholder="Billboard label" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
			<Separator />
		</>
	)
}
