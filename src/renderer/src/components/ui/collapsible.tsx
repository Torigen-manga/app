import {
	CollapsibleContent as PrimitiveCollapsibleContent,
	CollapsibleTrigger as PrimitiveCollapsibleTrigger,
	Root,
} from "@radix-ui/react-collapsible";

function Collapsible({ ...props }: React.ComponentProps<typeof Root>) {
	return <Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
	...props
}: React.ComponentProps<typeof PrimitiveCollapsibleTrigger>) {
	return (
		<PrimitiveCollapsibleTrigger data-slot="collapsible-trigger" {...props} />
	);
}

function CollapsibleContent({
	...props
}: React.ComponentProps<typeof PrimitiveCollapsibleContent>) {
	return (
		<PrimitiveCollapsibleContent data-slot="collapsible-content" {...props} />
	);
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
