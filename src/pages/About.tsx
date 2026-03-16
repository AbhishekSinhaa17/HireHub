import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <div className="flex-grow container mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-6 text-center">
          About ApplyWise
        </h1>

        <p className="text-lg text-gray-600 mb-6 text-center max-w-3xl mx-auto">
          ApplyWise is a modern job portal designed to connect job seekers
          with recruiters efficiently. Our platform simplifies the hiring
          process by allowing candidates to discover opportunities and
          recruiters to find the best talent quickly.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-10">

          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">For Job Seekers</h3>
            <p className="text-gray-600">
              Search and apply to jobs easily, track applications, and manage
              your profile in one place.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">For Recruiters</h3>
            <p className="text-gray-600">
              Post jobs, review applications, and connect with talented
              candidates efficiently.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To simplify the job search and recruitment process using modern
              web technologies.
            </p>
          </div>

        </div>
      </div>

      <Footer />

    </div>
  );
};

export default About;