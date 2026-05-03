
async function checkSupabase() {
  const url = "https://wqatzfqdxblztmwmvnzg.supabase.co";
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
checkSupabase();
