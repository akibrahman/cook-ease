import Container from "../Shared/Container";

const HomeBanner = () => {
  return (
    <Container>
      <div className="flex flex-col md:flex-row gap-10 items-center justify-between py-10 md:h-[calc(100vh-56px)]">
        <div className="w-[90%] md:w-1/2">
          <p className="text-white text-[30px] md:text-[40px] font-semibold mb-4">
            Cook Ease: Elevate Your Dining!
          </p>
          <p className="w-[80%] text-white">
            Enjoy the ease of having wholesome and nutritious meals delivered
            straight to your university hostel room. Our online meal service
            ensures that you do not have to compromise on quality or flavor,
            providing a convenient solution for your busy student life.
          </p>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              placeholder="Subscribe to our newsletter"
              className="bg-[#282828] text-white px-4 py-2 rounded-l-md focus:outline-none w-[200px] md:w-[250px] lg:w-[320px]"
            />
            <button className="bg-red-600 text-white px-6 py-2 rounded-r-md hover:bg-red-700 focus:outline-none">
              Subscribe
            </button>
          </div>
        </div>
        <div className="w-[90%] md:w-1/2">
          <img className="" src="/home-banner.png" alt="" />
        </div>
      </div>
    </Container>
  );
};

export default HomeBanner;
