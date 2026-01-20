import { useEffect, useState } from 'react';
import { ArrowRight, Award, Users, Briefcase } from 'lucide-react';
import { supabase, type Project } from '../lib/supabase';

type HomePageProps = {
  onNavigate: (page: string) => void;
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProjects();
  }, []);

  const loadFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedProjects(data || []);
    } catch (error) {
      console.error('Error loading featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>

        <div className="header-content relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Designing Spaces<br />That Inspire
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200 leading-relaxed">
            Award-winning architecture firm creating innovative, sustainable, and timeless designs
            .
          </p> <br></br>
          <span className='mt-0 mb-4 flex pb-3 -inset-8 justify-center items-center leading-relaxed
          sm:hidden font-bold text-2xl pl-3 lg:text-3xl'>
             This website had been design by Hoang Phu Qui for educational purpose
             </span>
          <button
            onClick={() => onNavigate('projects')}
            className="bg-white text-slate-900 px-8 py-4 rounded-[40px] font-semibold text-lg hover:bg-slate-100 transition-all
            transform hover:scale-105 hover:bg-gray-600 hover:text-white inline-flex items-center space-x-2"
          >
            <span>View Our Work</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-white-200 to-blue-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-slate-800" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">25+</h3>
              <p className="text-slate-600">Design Awards</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-800" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">150+</h3>
              <p className="text-slate-600">Completed Projects</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-800" />
              </div>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">20+</h3>
              <p className="text-slate-600">Team Members</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-l from-white-200 to-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Featured Projects</h2>
            <p className="text-xl text-slate-600">Explore our latest architectural achievements</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => onNavigate('projects')}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-slate-900">
                      {project.year}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-slate-500 mb-2 uppercase tracking-wide">
                      {project.category}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-2">{project.description}</p>
                    <p className="text-sm text-slate-500 mt-3">{project.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center space-x-2 bg-slate-900 text-white px-8 py-3 rounded-[60px] font-semibold hover:bg-slate-200 hover:text-black hover:scale-105 transition-all duration-300  transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Creating Tomorrow's Landmarks Today
              </h2>
              <p className="text-lg text-white mb-6 leading-relaxed">
                With over two decades of experience, our team brings together creative vision and
                technical expertise to deliver exceptional architectural solutions. We believe in
                design that not only meets functional needs but also enriches the human experience.
              </p>
              <p className="text-lg text-slate-200 mb-8 leading-relaxed">
                From sustainable residential projects to large-scale commercial developments, we
                approach each project with the same dedication to excellence and innovation.
              </p>
              <button
                onClick={() => onNavigate('team')}
                className="inline-flex items-center space-x-2 text-slate-900 font-semibold hover:underline"
              >
                <span>Meet Our Team</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Architecture workspace"
                className="rounded-lg w-full h-64 object-cover"
              />
              <img
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Team collaboration"
                className="rounded-lg w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
