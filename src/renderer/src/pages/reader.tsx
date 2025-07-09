import { Card } from "@renderer/components/ui/card";
import { extensionMethods } from "@renderer/hooks/extensions";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

export default function Reader(): React.JSX.Element {
	const { source, mangaId, chapterId } = useParams();

	const { data } = extensionMethods.useChapterDetails(
		source,
		mangaId,
		chapterId
	);

	const [currentPage, setCurrentPage] = useState(1);
	const mainRef = useRef<HTMLDivElement>(null);
	const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
	const currentVisibleIndexRef = useRef<number | null>(null);

	useEffect(() => {
		if (!data?.pages?.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				let bestIndex = -1;
				let bestRatio = 0;

				entries.forEach((entry) => {
					const index = imageRefs.current.findIndex(
						(img) => img === entry.target
					);
					const ratio = entry.intersectionRatio;

					if (entry.isIntersecting && ratio > bestRatio) {
						bestRatio = ratio;
						bestIndex = index;
					}
				});

				if (bestIndex !== -1) {
					const current = currentVisibleIndexRef.current;
					if (
						current === null ||
						(bestIndex !== current &&
							bestRatio > 0.1 && // only update if new image is at least 10% visible
							bestRatio -
								(entries.find(
									(e) =>
										imageRefs.current.findIndex((img) => img === e.target) ===
										current
								)?.intersectionRatio ?? 0) >
								0.1) // prevent frequent switching
					) {
						currentVisibleIndexRef.current = bestIndex;
						setCurrentPage(bestIndex + 1);
					}
				}
			},
			{
				root: null,
				threshold: [0, 0.5, 1.0], // More appropriate thresholds for page switching
				rootMargin: "0px",
			}
		);

		// Observer setup with a debounce-like timer to delay the start of the observation
		const timer = setTimeout(() => {
			imageRefs.current.forEach((img) => {
				if (img) observer.observe(img);
			});
		}, 500);

		return () => {
			observer.disconnect();
			clearTimeout(timer);
			currentVisibleIndexRef.current = null;
		};
	}, [data?.pages?.length]);

	return (
		<main className="relative flex w-full justify-center overflow-y-scroll">
			<Card className="fixed top-10 right-10 z-10 p-2">
				Page {currentPage} of {data?.pages?.length || 0}
			</Card>
			<div className="flex max-w-3xl flex-col" ref={mainRef}>
				{data?.pages?.map((page, index) => (
					<img
						alt={`Page ${index + 1}`}
						key={page}
						ref={(el) => {
							imageRefs.current[index] = el;
						}}
						src={page}
					/>
				))}
			</div>
		</main>
	);
}
