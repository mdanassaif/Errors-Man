// Advertisement.jsx
import { Twitter, Linkedin, Github, Youtube, Group } from 'lucide-react';

export function Advertisement() {
  return (
    <div className="bg-white rounded-lg  mb-6">
      {/* <h3 className="text-gray-900 pt-2 pl-2 text-lg font-bold mb-2">Sponsored</h3>
      <div className="rounded-lg p-4">
        <iframe
          src="https://cards.producthunt.com/cards/posts/555894?v=1"
          className="w-full h-[300px]"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        />
      </div> */}

      <div className="max-w-2xl mx-auto p-4">
        {/* Social Media Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Connect With Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Twitter */}

            <a href="https://twitter.com/mdanassaif"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <Twitter className="w-6 h-6 text-blue-400" />
              <div className="text-left">
                <h3 className="font-semibold text-sm">Twitter</h3>
                <p className="text-xs text-gray-600">Daily updates</p>
              </div>
            </a>

            {/* LinkedIn */}

            <a href="https://linkedin.com/in/mdanassaif"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <Linkedin className="w-6 h-6 text-blue-700" />
              <div className="text-left">
                <h3 className="font-semibold text-sm">LinkedIn</h3>
                <p className="text-xs text-gray-600">Professional</p>
              </div>
            </a>

            {/* GitHub */}

            <a href="https://github.com/mdanassaif"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <Github className="w-6 h-6 text-gray-700" />
              <div className="text-left">
                <h3 className="font-semibold text-sm">GitHub</h3>
                <p className="text-xs text-gray-600">Our code</p>
              </div>
            </a>

            {/* Telegram */}

            <a href="https://t.me/+fpr06YFaR_M0YmE1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <Group className="w-6 h-6 text-pink-700" />
              <div className="text-left">
                <h3 className="font-semibold text-sm">Telegram</h3>
                <p className="text-xs text-gray-600">Our Group</p>
              </div>
            </a>
          </div>
        </div>

        {/* YouTube Video Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Latest Video</h2>
          <div className="w-full">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/On-mwSVnszw?si=ZGiW2IWa9_rrSDha"
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Subscribe Button */}
          <div className="mt-4">

            <a href="https://www.youtube.com/@mdanassaif"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <Youtube className="w-5 h-5" />
              <span className="text-sm font-medium">Subscribe</span>
            </a>
          </div>
        </div>

        <div className="mt-8">
  <h2 className="text-lg font-bold mb-4">Latest Blog</h2>
  <div className="w-full">
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      {/* Blog Image */}
      <img
        src="https://mdanassaif.vercel.app/_next/image?url=https%3A%2F%2Flcmbjbjvfatzaqcfdygk.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fmyblogs%2Fblog5.jpg%3Ft%3D2025-01-07T21%253A37%253A40.036Z&w=3840&q=75" // Replace with your blog image URL
        alt="Latest Blog"
        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
      />
    </div>
  </div>

  {/* Read Button */}
  <div className="mt-4">
    <a
      href="https://mdanassaif.vercel.app/blog/how-to-learn-coding-in-2025" // Replace with your blog URL
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
    >
      <Youtube className="w-5 h-5" />
      <span className="text-sm font-medium">Read</span>
    </a>
  </div>
</div>
      </div>
    </div>
  );
}