export function Advertisement() {
  return (
    <div className="bg-white rounded-lg  mb-6">
      <h3 className="text-lg font-semibold text-gray-900 pt-2 pl-2">Sponsored</h3>
      <div className=" rounded-lg p-4">
        <iframe 
          src="https://cards.producthunt.com/cards/posts/555894?v=1" 
          className="w-full h-[300px]"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        />
      </div>
     
    </div>
  );
}