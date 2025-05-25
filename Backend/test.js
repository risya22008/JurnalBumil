const { getFirestore, collection, query, where, getDocs } = require("firebase/firestore");

async function getRecentNotes() {
  // const db = getFirestore();
  // const notesRef = collection(db, "Catatan");

  // Calculate 7 days ago
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const pad = (n) => n.toString().padStart(2, '0');
  const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const sevenDaysAgoStr = formatDate(sevenDaysAgo);
  console.log(sevenDaysAgoStr)

  console.log(sevenDaysAgo)
  // const q = query(notesRef, where("createdAt", ">=", sevenDaysAgoStr));
  // const snapshot = await getDocs(q);
  // const recentNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // console.log(recentNotes);
}

getRecentNotes();
