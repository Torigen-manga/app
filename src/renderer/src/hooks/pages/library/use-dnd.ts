import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

export function useDragAndDrop() {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	return { sensors };
}
