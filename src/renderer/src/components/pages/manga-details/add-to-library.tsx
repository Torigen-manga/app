import type { AppManga } from "@common/index";
import { useLibraryDialog } from "@renderer/hooks/pages/manga-details/use-library-dialog";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";

interface MangaAddDialogProps {
	children: React.ReactNode;
	manga: AppManga;
}

export function MangaAddToLibrary({
	children,
	manga,
}: MangaAddDialogProps): React.JSX.Element {
	const {
		selectValue,
		setSelectValue,
		newCategoryName,
		setNewCategoryName,
		formError,
		isOpen,
		setIsOpen,
		addToCategory,
		setAddToCategory,
		categoryList,
		isAddDisabled,
		handleAdd,
		reset,
	} = useLibraryDialog(manga);

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add to Library</DialogTitle>
					<DialogDescription>
						Select a category to add this manga to your library.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Checkbox
							checked={addToCategory}
							id="add-to-category"
							onCheckedChange={(checked) => setAddToCategory(checked === true)}
						/>
						<Label className="text-sm" htmlFor="add-to-category">
							Add to category
						</Label>
					</div>

					{addToCategory && (
						<div className="space-y-2">
							<Label htmlFor="category-select">Category</Label>
							<Select onValueChange={setSelectValue} value={selectValue}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									{categoryList.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{selectValue === "new-ct" && (
								<div className="space-y-2">
									<Label htmlFor="new-category">New Category Name</Label>
									<Input
										id="new-category"
										onChange={(e) => setNewCategoryName(e.target.value)}
										placeholder="Enter new category name"
										value={newCategoryName}
									/>
								</div>
							)}
						</div>
					)}

					{formError && <p className="text-red-500">{formError}</p>}
				</div>

				<DialogFooter>
					<Button onClick={reset} variant="outline">
						Cancel
					</Button>
					<Button disabled={isAddDisabled} onClick={handleAdd}>
						Add
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
