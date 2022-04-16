import { useEffect, useRef, useState } from 'react';
import {
	BlockContainer,
	ScrollbarContainer,
	Scrollbar,
	ImageContainer,
	LeftButton,
	RightButton,
	Image,
} from './styles.js';
import { FlexContainer } from '../styles';

const IMAGE_COUNT = 8;

function Carousel() {
	const [imageIndex, setImageIndex] = useState(0);
	const [showNav, setShowNav] = useState(false);
	const scrollbarRef = useRef(null);

	const moveLeft = () =>
		setImageIndex(imageIndex === 0 ? IMAGE_COUNT - 1 : imageIndex - 1);
	const moveRight = () =>
		setImageIndex(imageIndex === IMAGE_COUNT - 1 ? 0 : imageIndex + 1);

	return (
		<FlexContainer>
			<BlockContainer>
				<ImageContainer
					onMouseOver={(_) => setShowNav(true)}
					onMouseLeave={(_) => setShowNav(false)}
				>
					<LeftButton showNav={showNav} onClick={moveLeft}>
						{'<'}
					</LeftButton>
					<Image>Image Index: {imageIndex}</Image>
					<RightButton showNav={showNav} onClick={moveRight}>
						{'>'}
					</RightButton>
				</ImageContainer>
				<ScrollbarContainer
					ref={scrollbarRef}
					onClick={(event) => {
						const containerDomRect =
							scrollbarRef.current.getBoundingClientRect();
						// Using clientX and containerDomRect values that are relative to viewport
						setImageIndex(
							Math.floor(
								((event.clientX - containerDomRect.x) * IMAGE_COUNT) /
									containerDomRect.width
							)
						);
					}}
				>
					<Scrollbar
						width={`${100 / IMAGE_COUNT}%`}
						left={`${(imageIndex * 100) / IMAGE_COUNT}%`}
					></Scrollbar>
				</ScrollbarContainer>
			</BlockContainer>
		</FlexContainer>
	);
}

export default Carousel;
