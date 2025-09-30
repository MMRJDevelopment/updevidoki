import Banner from "./Banner/Banner";
import Love from "./Love";
import Testimonials from "./Testimonials/Testimonials";
import Tribute from "./Tribute";
import WorksProcess from "./WorksProcess/WorksProcess";

// import LoginWithGoogle from "@/components/LoginWithGoogle";

const HomeComponent = () => {
	return (
		<>
			<Banner />
			<WorksProcess />
			<Love />
			<Tribute />
			<Testimonials />
		</>
	);
};

export default HomeComponent;
