// api/sync-appointments.js

export default async function handler(req, res) {
  const syncApiKey = req.headers['x-sync-api-key'];
  const expectedKey = process.env.SYNC_API_KEY;

  if (expectedKey && syncApiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Sync API Key' });
  }

  const bucket = 'healthy_eye_clinic_v1';
  const key = 'appointments';
  const url = `https://kvdb.io/${bucket}/${key}`;

  const getAppointments = async () => {
    try {
      const response = await fetch(url);
      if (response.status === 404) {
        return [];
      }
      return await response.json();
    } catch (e) {
      return [];
    }
  };

  if (req.method === 'GET') {
    const { phone, email } = req.query;
    let list = await getAppointments();
    if (email) {
      list = list.filter(item => item.email === email);
    } else if (phone) {
      list = list.filter(item => item.phone === phone);
    }
    return res.status(200).json(list);
  }

  if (req.method === 'POST') {
    const newAppointment = req.body;
    if (!newAppointment || !newAppointment.patientName || (!newAppointment.phone && !newAppointment.email)) {
      return res.status(400).json({ error: 'Invalid appointment details' });
    }

    const list = await getAppointments();
    
    if (!newAppointment.id) {
      newAppointment.id = 'online_' + Math.random().toString(36).substr(2, 9);
      newAppointment.createdAt = new Date().toISOString();
    }

    const existingIndex = list.findIndex(item => item.id === newAppointment.id);
    if (existingIndex > -1) {
      list[existingIndex] = { ...list[existingIndex], ...newAppointment };
    } else {
      list.push(newAppointment);
    }

    try {
      await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(list),
        headers: { 'Content-Type': 'application/json' }
      });
      return res.status(200).json({ success: true, appointment: newAppointment });
    } catch (error) {
      console.error('Error saving appointment:', error);
      return res.status(500).json({ error: 'Failed to sync appointment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
