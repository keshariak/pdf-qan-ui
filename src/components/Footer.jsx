export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white text-center py-6 mt-10 w-full">
        <p className="text-lg font-semibold">Developed by Boogeyman</p>
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
        <p className="text-sm text-gray-400">Built with React & Tailwind CSS</p>
      </footer>
    );
  }