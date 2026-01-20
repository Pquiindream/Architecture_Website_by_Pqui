import { Building2, Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-8 h-8" />
              <span className="text-xl font-semibold">ARCH of HPQ</span>
            </div>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Creating innovative and sustainable architectural solutions that inspire and endure.
              We transform visions into reality through thoughtful design and meticulous execution.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>123 Tue Tinh Street<br />13 Ward, Ho Chi Minh City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+84 (3384) 793 - 75</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>archstudiobyqui@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
            <div className="space-y-2 text-slate-400">
              <p>Monday - Friday</p>
              <p className="font-medium text-white">9:00 AM - 6:00 PM</p>
              <p className="mt-3">Saturday</p>
              <p className="font-medium text-white">By Appointment</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 backdrop-blur-0 mt-12 pt-8 text-center text-slate-200 font-bold text-sm">
          <p>&copy; {new Date().getFullYear()} ARCH Studio. All rights reserved. <br></br>
            <span>
              wait for new creative design from  <span className='font-bold text-xl uppercase'>pqui</span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
