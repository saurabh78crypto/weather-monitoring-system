import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBell, FaChartLine, FaSun, FaCloud } from 'react-icons/fa';


const Navbar = ({ alertCount }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <Link className="navbar-brand ms-3 fw-bold" to="/">
        Weather Monitor 
      </Link>
      <button 
        className="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto me-5">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <FaHome className="me-1" /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/thresholds">
              <FaSun className="me-1" /> Thresholds
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/summaries">
              <FaCloud className="me-1" /> Daily Summaries
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/alerts">
              <FaBell className="me-1" /> Alerts
              {alertCount > 0 && (
                <span className="badge bg-danger ms-2">{alertCount}</span>
              )}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/trends">
              <FaChartLine className="me-1" /> Historical Trends
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
