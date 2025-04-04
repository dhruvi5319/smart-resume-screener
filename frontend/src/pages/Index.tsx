
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-white z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center md:text-left md:max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              AI-Powered Resume<br className="hidden sm:block" /> Analysis for HR
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl">
              Streamline your hiring process with advanced AI technology that matches candidates to job descriptions, analyzes skills, and provides data-driven insights.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg py-6">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 h-full bg-gradient-to-l from-brand-100 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How ScreenWise Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform simplifies the resume screening process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Resumes</h3>
              <p className="text-gray-600">
                Easily upload candidate resumes in PDF or DOCX format with our intuitive drag-and-drop interface.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Define Job Requirements</h3>
              <p className="text-gray-600">
                Enter job descriptions and requirements to let our AI know exactly what you're looking for in candidates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes resumes, matching candidates to job requirements and providing detailed skill assessments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose ScreenWise</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique advantages for HR professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center text-success-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Time</h3>
                <p className="text-gray-600">
                  Reduce resume screening time by up to 75% with automated AI analysis. Focus on interacting with top candidates instead of sorting through stacks of resumes.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center text-warning-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Reduce Bias</h3>
                <p className="text-gray-600">
                  Our AI focuses on skills and qualifications, helping to minimize unconscious bias in the hiring process and promote diversity.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Improve Quality of Hire</h3>
                <p className="text-gray-600">
                  Make data-driven decisions based on AI-generated match scores and detailed skill assessments to find the perfect candidates.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enhanced Candidate Experience</h3>
                <p className="text-gray-600">
                  Respond to candidates faster and with more personalized feedback based on their specific skills and qualifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform your hiring process?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
            Join thousands of HR professionals who are saving time and making better hiring decisions with ScreenWise.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg py-6">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white text-lg font-semibold mb-4">ScreenWise</h3>
              <p className="text-gray-400 mb-4 max-w-md">
                AI-powered resume analysis platform for HR professionals. Simplify your hiring process and find the best candidates faster.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ScreenWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
