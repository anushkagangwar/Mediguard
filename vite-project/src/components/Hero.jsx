// export default function Hero() {
//   return (
//     <section className="hero">

//       <div className="badge">
//         Calm, clinical, caring
//       </div>

//       <h1>
//         Never miss a dose.
//         <span> Keep family in the loop.</span>
//       </h1>

//       <p>
//         MediGuard turns medicine schedules into gentle reminders,
//         tracks adherence, and lets trusted family caregivers
//         monitor doses in real time.
//       </p>

//       <div className="hero-buttons">
//         <button className="primary">
//           Create your free account
//         </button>

//         <button className="secondary">
//           I already have an account
//         </button>
//       </div>

//     </section>
//   );
// }
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">

      <div className="badge">
        Calm, clinical, caring
      </div>

      <h1>
        Never miss a dose.
        <span> Keep family in the loop.</span>
      </h1>

      <p>
        MediGuard turns medicine schedules into gentle reminders,
        tracks adherence, and lets trusted family caregivers
        monitor doses in real time.
      </p>

      <div className="hero-buttons">

        <Link to="/register">
          <button className="primary">
            Create your free account
          </button>
        </Link>

        <Link to="/login">
          <button className="secondary">
            I already have an account
          </button>
        </Link>

      </div>

    </section>
  );
}