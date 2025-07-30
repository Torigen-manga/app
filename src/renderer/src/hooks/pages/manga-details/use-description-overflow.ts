import { useLayoutEffect, useRef, useState } from "react";

export function useDescriptionOverflow() {
	const [isOverflow, setIsOverflow] = useState(false);
	const descRef = useRef<HTMLParagraphElement>(null);

	useLayoutEffect(() => {
		const element = descRef.current;
		if (!element) {
			return;
		}

		const checkOverflow = () => {
			const originalClamp = element.style.webkitLineClamp;
			element.style.webkitLineClamp = "unset";

			const scrollHeight = element.scrollHeight;

			element.style.webkitLineClamp = originalClamp || "3";

			const clientHeight = element.clientHeight;
			setIsOverflow(scrollHeight > clientHeight);
		};

		checkOverflow();

		const resizeObserver = new ResizeObserver(checkOverflow);
		resizeObserver.observe(element);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return { isOverflow, descRef };
}
