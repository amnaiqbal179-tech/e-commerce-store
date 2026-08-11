export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-[10px] sm:text-xs py-2 px-4 text-center relative flex justify-center items-center">
      <p className="font-satoshi">
        Sign up and get 20% off to your first order.{' '}
        <span className="underline cursor-pointer font-medium ml-1">Sign Up Now</span>
      </p>
      <button className="absolute right-4 text-white hidden md:block hover:opacity-75">
        ✕
      </button>
    </div>
  );
}