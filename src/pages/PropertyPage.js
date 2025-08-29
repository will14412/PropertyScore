import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddressSelector from '../components/AddressSelector';
import StatCard from '../components/StatCard';
import StatusPanel from '../components/StatusPanel';

/**
 * The PropertyPage is responsible for presenting detailed information
 * about a specific property. It guides the user through selecting the
 * correct address (via getAddress) and then orchestrates a series of
 * API calls to gather data about the property. Each API call updates
 * a status tracker which is rendered in a persistent status panel.
 */
const PropertyPage = () => {
  const { postcode } = useParams();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [results, setResults] = useState({});
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch address options when the page loads
  useEffect(() => {
    async function fetchAddresses() {
      try {
        // Fetch addresses for the postcode using getAddress.io
        const response = await fetch(
          `https://api.getAddress.io/find/${encodeURIComponent(postcode)}?api-key=${process.env.REACT_APP_GETADDRESS_API_KEY}&expand=true`
        );
        const data = await response.json();
        if (data && data.addresses) {
          // Map the API response into user friendly strings
          const formatted = data.addresses.map((item) => {
            // The API returns properties like line_1, line_2, locality, town_or_city, county and postcode
            // Collect all available parts so the full address is displayed rather than just town and county
            const lines = [];
            ['line_1', 'line_2', 'line_3', 'line_4', 'locality', 'town_or_city', 'county', 'postcode'].forEach((key) => {
              if (item[key]) lines.push(item[key]);
            });
            return lines.join(', ');
          });
          setAddresses(formatted);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    }
    if (postcode) {
      fetchAddresses();
    }
  }, [postcode]);

  /**
   * Utility function to set the status of a single API task
   */
  const setStatus = (name, status) => {
    setStatuses((prev) => ({ ...prev, [name]: status }));
  };

  /**
   * Trigger the sequence of API calls to gather property data.
   */
  const handleFetchData = async () => {
    if (!selectedAddress) return;
    setLoading(true);
    // Initialize all statuses to pending. These keys match the logical steps
    // in the property analysis pipeline. Feel free to add or remove keys
    // depending on which datasets you integrate.
    const initialStatuses = {
      UPRN: 'pending',
      Boundaries: 'pending',
      Transactions: 'pending',
      EPC: 'pending',
      Planning: 'pending',
      Flood: 'pending',
      Environment: 'pending',
      Noise: 'pending',
      Radon: 'pending',
      Crime: 'pending',
      Schools: 'pending',
      Health: 'pending',
      Transport: 'pending',
      Amenities: 'pending',
      Demographics: 'pending',
      CouncilTax: 'pending',
    };
    setStatuses(initialStatuses);
    const collected = {};

    /**
     * Fetch the UPRN for the selected address using the Ordnance Survey Places API.
     * This call is fundamental because many other datasets can then be joined
     * using the UPRN as a key. If the API call fails, subsequent calls may
     * still execute based on the postcode.
     */
    async function fetchUPRN() {
      setStatus('UPRN', 'loading');
      try {
        const url = `https://api.os.uk/search/places/v1/find?query=${encodeURIComponent(selectedAddress)}&key=${process.env.REACT_APP_OS_PLACES_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        collected.UPRN = data;
        setStatus('UPRN', 'success');
        return data;
      } catch (error) {
        console.error('UPRN error', error);
        setStatus('UPRN', 'error');
        throw error;
      }
    }

    async function fetchBoundaries() {
      setStatus('Boundaries', 'loading');
      try {
        const response = await fetch(`https://mapit.mysociety.org/postcode/${encodeURIComponent(postcode)}`);
        const data = await response.json();
        collected.Boundaries = data;
        setStatus('Boundaries', 'success');
      } catch (error) {
        console.error('Boundaries error', error);
        setStatus('Boundaries', 'error');
      }
    }

    async function fetchTransactions() {
      setStatus('Transactions', 'loading');
      try {
        // Land Registry Price Paid Data via data.gov.uk. This endpoint returns
        // recent transactions for the given postcode. See
        // https://landregistry.data.gov.uk/app/ppd for documentation.
        const response = await fetch(
          `https://landregistry.data.gov.uk/data/ppd/v1/postcode/${encodeURIComponent(postcode)}.json`
        );
        const data = await response.json();
        collected.Transactions = data;
        setStatus('Transactions', 'success');
      } catch (error) {
        console.error('Transactions error', error);
        setStatus('Transactions', 'error');
      }
    }

    async function fetchEPC() {
      setStatus('EPC', 'loading');
      try {
        const response = await fetch(
          `https://epc.opendatacommunities.org/api/v1/domestic/dec-summary?postcode=${encodeURIComponent(
            postcode
          )}`,
          {
            headers: {
              Accept: 'application/json',
              // The API uses Basic auth with a key. If you have an API key and secret,
              // set them in your environment and encode here accordingly. For
              // demonstration we'll just send the API key via header.
              Authorization: `Basic ${btoa(
                `${process.env.REACT_APP_EPC_API_KEY}:`
              )}`,
            },
          }
        );
        const data = await response.json();
        collected.EPC = data;
        setStatus('EPC', 'success');
      } catch (error) {
        console.error('EPC error', error);
        setStatus('EPC', 'error');
      }
    }

    async function fetchPlanning() {
      setStatus('Planning', 'loading');
      try {
        // Query planning.data.gov.uk for planning applications near the postcode
        const response = await fetch(
          `https://planning.data.gov.uk/entities.json?postcode=${encodeURIComponent(
            postcode
          )}`
        );
        const data = await response.json();
        collected.Planning = data;
        setStatus('Planning', 'success');
      } catch (error) {
        console.error('Planning error', error);
        setStatus('Planning', 'error');
      }
    }

    async function fetchFlood() {
      setStatus('Flood', 'loading');
      try {
        const response = await fetch(
          `https://environment.data.gov.uk/flood-monitoring/id/postcodes/${encodeURIComponent(
            postcode
          )}.json`
        );
        const data = await response.json();
        collected.Flood = data;
        setStatus('Flood', 'success');
      } catch (error) {
        console.error('Flood error', error);
        setStatus('Flood', 'error');
      }
    }

    async function fetchEnvironment() {
      setStatus('Environment', 'loading');
      try {
        // The UK‑AIR API returns air quality information for a given postcode. You
        // must sign up for an API key. Replace the endpoint with the correct
        // service if it changes.
        const response = await fetch(
          `https://api.erg.ic.ac.uk/AirQuality/Postcode?postcode=${encodeURIComponent(
            postcode
          )}&key=${process.env.REACT_APP_AIR_QUALITY_API_KEY}`
        );
        const data = await response.json();
        collected.Environment = data;
        setStatus('Environment', 'success');
      } catch (error) {
        console.error('Environment error', error);
        setStatus('Environment', 'error');
      }
    }

    async function fetchNoise() {
      setStatus('Noise', 'loading');
      try {
        // There is no simple REST API for noise mapping; you may need to call
        // DEFRA's strategic noise dataset via WMS/WFS. Here we stub an
        // empty response to satisfy the interface.
        collected.Noise = {};
        setStatus('Noise', 'success');
      } catch (error) {
        console.error('Noise error', error);
        setStatus('Noise', 'error');
      }
    }

    async function fetchRadon() {
      setStatus('Radon', 'loading');
      try {
        // The radon potential dataset does not have a public API. You can
        // integrate BGS GeoSure WMS if you license it. Here we stub.
        collected.Radon = {};
        setStatus('Radon', 'success');
      } catch (error) {
        setStatus('Radon', 'error');
      }
    }

    async function fetchCrime() {
      setStatus('Crime', 'loading');
      try {
        const response = await fetch(
          `https://data.police.uk/api/crimes-street/all-crime?postcode=${encodeURIComponent(
            postcode
          )}`
        );
        const data = await response.json();
        collected.Crime = data;
        setStatus('Crime', 'success');
      } catch (error) {
        console.error('Crime error', error);
        setStatus('Crime', 'error');
      }
    }

    async function fetchSchools() {
      setStatus('Schools', 'loading');
      try {
        // The DfE does not provide a straightforward API; you may need to
        // integrate CSV downloads or a third party API. Here we stub.
        collected.Schools = {};
        setStatus('Schools', 'success');
      } catch (error) {
        setStatus('Schools', 'error');
      }
    }

    async function fetchHealth() {
      setStatus('Health', 'loading');
      try {
        const response = await fetch(
          `https://directory.spineservices.nhs.uk/ORD/2-0-0/organizationalunits?postcode=${encodeURIComponent(
            postcode
          )}&api_key=${process.env.REACT_APP_NHS_API_KEY}`
        );
        const data = await response.json();
        collected.Health = data;
        setStatus('Health', 'success');
      } catch (error) {
        console.error('Health error', error);
        setStatus('Health', 'error');
      }
    }

    async function fetchTransport() {
      setStatus('Transport', 'loading');
      try {
        // TravelTime API typically expects coordinates and a post body; for
        // demonstration we call a fictional endpoint. Replace with real
        // request when integrating.
        const response = await fetch(
          `https://api.traveltimeapp.com/v4/time-map?postcode=${encodeURIComponent(
            postcode
          )}`,
          {
            headers: {
              'X-Api-Key': process.env.REACT_APP_TRAVELTIME_API_KEY,
            },
          }
        );
        const data = await response.json();
        collected.Transport = data;
        setStatus('Transport', 'success');
      } catch (error) {
        console.error('Transport error', error);
        setStatus('Transport', 'error');
      }
    }

    async function fetchAmenities() {
      setStatus('Amenities', 'loading');
      try {
        // To use Overpass API properly you need lat/lon. Here we simply stub
        // the call because the lat/lon is not yet extracted. A real
        // implementation would first parse the UPRN data or OS Places
        // response to get coordinates and then build an Overpass query.
        collected.Amenities = {};
        setStatus('Amenities', 'success');
      } catch (error) {
        console.error('Amenities error', error);
        setStatus('Amenities', 'error');
      }
    }

    async function fetchDemographics() {
      setStatus('Demographics', 'loading');
      try {
        // The ONS API requires codes like LSOA to retrieve census data. Once
        // you have boundaries from MapIt you can extract the LSOA code and
        // query the ONS dataset. This is stubbed for now.
        collected.Demographics = {};
        setStatus('Demographics', 'success');
      } catch (error) {
        setStatus('Demographics', 'error');
      }
    }

    async function fetchCouncilTax() {
      setStatus('CouncilTax', 'loading');
      try {
        // There is no free API for Council Tax band lookups. Many services
        // require scraping or commercial licensing. We stub the result.
        collected.CouncilTax = {};
        setStatus('CouncilTax', 'success');
      } catch (error) {
        setStatus('CouncilTax', 'error');
      }
    }

    try {
      await fetchUPRN();
      await Promise.all([
        fetchBoundaries(),
        fetchTransactions(),
        fetchEPC(),
        fetchPlanning(),
        fetchFlood(),
        fetchEnvironment(),
        fetchNoise(),
        fetchRadon(),
        fetchCrime(),
        fetchSchools(),
        fetchHealth(),
        fetchTransport(),
        fetchAmenities(),
        fetchDemographics(),
        fetchCouncilTax(),
      ]);
    } catch (error) {
      // Errors are handled individually within each call; this catch ensures
      // we transition out of the loading state even if one call throws.
      console.error('Pipeline error', error);
    } finally {
      setLoading(false);
      setResults(collected);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Property details</h1>
        <p className="text-gray-600 mb-4">
          Postcode: <strong>{postcode}</strong>
        </p>
        {/* Address selector. Display this until the user picks an address. */}
        {addresses.length > 0 && !selectedAddress && (
          <div className="mb-6">
            <AddressSelector
              addresses={addresses}
              selected={selectedAddress}
              onSelect={setSelectedAddress}
            />
            <button
              onClick={handleFetchData}
              className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              disabled={!selectedAddress}
            >
              Fetch property data
            </button>
          </div>
        )}
        {/* Main layout: results and status panel */}
        {selectedAddress && (
          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            {/* Results area */}
            <div className="flex-grow">
              {loading && (
                <p className="text-gray-600 mb-4">Fetching data…</p>
              )}
              {!loading && Object.keys(results).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {Object.keys(results).map((key) => (
                    <StatCard key={key} title={key}>
                      <pre className="text-xs whitespace-pre-wrap break-all">
                        {JSON.stringify(results[key], null, 2)}
                      </pre>
                    </StatCard>
                  ))}
                </div>
              )}
            </div>
            {/* Status panel stays visible at all times once a fetch is started */}
            {Object.keys(statuses).length > 0 && (
              <StatusPanel statuses={statuses} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPage;