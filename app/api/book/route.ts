// app/api/book/route.js
import { NextRequest, NextResponse } from 'next/server';

// Define the POST handler for this API route
export async function POST(request: NextRequest) {

  console.log("request recieved",request)
  // Define the Grist API URL and headers
  const url = `https://docs.getgrist.com/api/docs/${process.env.NEXT_PUBLIC_DOCID}/tables/${process.env.NEXT_PUBLIC_TABLE}/records`;
  const headers = {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API}`, // Your Grist API key
    'Content-Type': 'application/json'
  };

  try {
    // Get the payload from the request body using request.json()
    const payload = await request.json();
    console.log('Payload received:', payload.records); // Log the payload for debugging
    // Send POST request to Grist API
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
    console.log('Response from Grist API:', response); // Log the response for debugging
    // Check if the Grist API response was successful
    if (!response.ok) {
      const errorData = await response.json();
      // If Grist API returns an error, forward its status and message
      return NextResponse.json({
        message: 'Failed to submit to Grist',
        gristError: errorData
      }, { status: response.status });
    }

    // Parse the successful response from Grist
    const result = await response.json();
    console.log('Grist API response:', result); // Log the response for debugging

    // Return a success response to the client using NextResponse.json()
    return NextResponse.json({ message: 'Booking successfully submitted!', data: result }, { status: 200 });

  } catch (error:any) {
    console.error('Error in API route:', error); // Log any unexpected errors
    // Return a 500 Internal Server Error for any unhandled exceptions
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   console.log("GET request received");
//   // Handle GET requests if needed
//  const payload = {
//       records: [
//         {
//           fields: {
//             name: "louam",
//             phone: "50144403",
//             date: "2023-10-02",
//             email: "louam@gmail.com",
//             price: "30",
//             service: "test",
//             time: "12:00",
            
//           }
//         }
//       ]
//     };
//   const url = 'https://docs.getgrist.com/api/docs/8sUYgq2EhgAQ/tables/Table1/records';
//   const response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Authorization':'Bearer 26102bf93c60874174b04c6bfafdbe107ebcceea',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(payload)
//   });
//   if (!response.ok) {
//     console.log(response)
//     return NextResponse.json({ message: 'Failed to fetch data' }, { status: response.status });
//   }
//   const data = await response.json();
//   console.log('Data fetched:', data); // Log the fetched data for debugging
//   console.log('GET request received');
//   return NextResponse.json({ message: 'GET request received' }, { status: 200 });
// }
// You can also define other HTTP methods (GET, PUT, DELETE) here if needed
// export async function GET(request) { ... }
// export async function PUT(request) { ... }
// export async function DELETE(request) { ... }
