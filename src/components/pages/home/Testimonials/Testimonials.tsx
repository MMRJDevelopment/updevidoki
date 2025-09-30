import { Container } from "@/components/ui-library/container";
import { TestimonialsGrid } from "./TestimonialsGrid";
import { testimonials } from "@/data/testimonials";

const Testimonials = () => {
	return (
		<section className=" sm:py-16 py-8 bg-[#F5F7FB] lg:py-25">
			<Container>
				<h3 className="text-[#100C08]  font-Outfit  sm:text-4xl text-3xl lg:text-[56px] font-medium leading-[120%]">
					Testimonials
				</h3>
				<p className="lg:w-[613px] text-[#100C08] font-[Outfit] sm:text-lg text-sm lg:text-xl font-normal leading-[140%] mt-4">
					Testimonials offer heartfelt reflections from families who have
					preserved their loved ones’ memories through our memorial service.
				</p>
				<TestimonialsGrid items={testimonials} initialVisible={6} />
			</Container>
		</section>
	);
};

export default Testimonials;
