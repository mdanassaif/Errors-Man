export function ChatPage() {
  return (
    <div className="min-w-full chat-page container mx-auto p-0" style={{ height: "100vh", width: "100vw" }}>
      <iframe 
        src="https://livechatgroup007.vercel.app/" 
        title="Live Chat Group" 
        style={{ width: "100%", height: "100%", border: "none" }} 
        allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  );
}