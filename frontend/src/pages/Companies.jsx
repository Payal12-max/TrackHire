import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import { formatDate } from "../utils/date";

export default function Companies() {
  const { companies } = useApp();

  return (
    <div className="cards">
      {companies.map((company) => (
        <Card
          key={company.company}
          title={company.company}
        >
          <div className="companynums">
            <b>
              {company.applications}
              <small>Applications</small>
            </b>

            <b>
              {company.interviews}
              <small>Interviews</small>
            </b>

            <b>
              {company.offers}
              <small>Offers</small>
            </b>
          </div>

          <p>
            Last activity:{" "}
            {formatDate(company.last_activity)}
          </p>
        </Card>
      ))}
    </div>
  );
}