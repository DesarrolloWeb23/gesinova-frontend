import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { EmblaOptionsType } from 'embla-carousel'

import { DotButton, useDotButton } from '@/ui/components/EmblaCarouselDotButton'
import { PrevButton, NextButton, usePrevNextButtons } from '@/ui/components/EmblaCarouselArrowButtons'

interface EmblaCarouselProps {
    slides: string[]
    options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({ slides, options }) => {

    const autoplay = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
    )

    const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay.current])

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
        usePrevNextButtons(emblaApi)

    return (
        <section className="embla p-2">
        <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
                {slides.map((imgUrl: string, index: number) => (
                <div
                    key={index}
                    className={`embla__slide flex-[0_0_80%] min-w-0 h-[20rem] sm:h-[14rem] rounded-lg overflow-hidden transition-opacity duration-300 ${index === selectedIndex ? 'opacity-100' : 'opacity-40'}`}
                >
                    <img
                    src={imgUrl}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    />
                </div>
                ))}
            </div>
        </div>

        <div className="embla__controls">
            <div className="embla__buttons">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>

            <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
                <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={'embla__dot'.concat(
                    index === selectedIndex ? ' embla__dot--selected' : ''
                )}
                />
            ))}
            </div>
        </div>
        </section>
    )
}

export default EmblaCarousel
