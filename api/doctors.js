// api/doctors.js

export default async function handler(req, res) {
  const syncApiKey = req.headers['x-sync-api-key'];
  const expectedKey = process.env.SYNC_API_KEY;

  if (expectedKey && syncApiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Sync API Key' });
  }

  const bucket = 'healthy_eye_clinic_v1';
  const key = 'doctors';
  const url = `https://kvdb.io/${bucket}/${key}`;

  const getDoctors = async () => {
    try {
      const response = await fetch(url);
      if (response.status === 404) {
        return [
          { id: 'doc1', name: 'Dr. Nandhini Devi', specialty: 'Senior Consultant Ophthalmologist' },
          { id: 'doc2', name: 'Dr. Jawaharlal', specialty: 'Optometrist & Contact Lens Specialist' }
        ];
      }
      return await response.json();
    } catch (e) {
      return [];
    }
  };

  if (req.method === 'GET') {
    const list = await getDoctors();
    return res.status(200).json(list);
  }

  if (req.method === 'POST') {
    const doctorsList = req.body;
    try {
      await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(doctorsList),
        headers: { 'Content-Type': 'application/json' }
      });
      return res.status(200).json({ success: true, doctors: doctorsList });
    } catch (error) {
      console.error('Error saving doctors:', error);
      return res.status(500).json({ error: 'Failed to sync doctors' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
