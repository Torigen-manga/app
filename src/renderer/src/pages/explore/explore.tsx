import { Button } from "@renderer/components/ui/button";
import { useLoadExtensions } from "@renderer/hooks/extensions/registry";
import { Link } from "react-router";

export default function Explore(): React.JSX.Element {
	const { data, isLoading } = useLoadExtensions();

	if (isLoading) {
		return (
			<div className="h-full w-full items-center justify-center">
				Loading extensions...
			</div>
		);
	}

	if (!(data || isLoading)) {
		return <div className="text-red-500">Failed to load extensions</div>;
	}

	if (data) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center">
				<h1 className="mb-4 font-bold text-4xl">Select a extension</h1>
				{data.map((ext) => (
					<Link key={ext.id} to={`/explore/${ext.id}`}>
						<Button
							className="cursor-pointer px-2"
							key={ext.id}
							variant="outline"
						>
							<img alt="" className="size-8" src={ext.iconUrl} />
							{ext.name}
						</Button>
					</Link>
				))}
			</div>
		);
	}

	return <>test</>;
}
