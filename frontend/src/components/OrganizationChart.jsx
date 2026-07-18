import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { FaUserTie, FaUserShield, FaUserEdit, FaUser } from 'react-icons/fa';

const roleIcons = {
  super_admin: <FaUserShield className="text-pink-500 text-xl" />,
  admin: <FaUserShield className="text-purple-600 text-xl" />,
  hr: <FaUserEdit className="text-lime-500 text-xl" />,
  team_lead: <FaUserTie className="text-yellow-500 text-xl" />,
  employee: <FaUser className="text-gray-400 text-xl" />
};

const OrgNode = ({ user, childrenNodes }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm flex flex-col items-center justify-center min-w-[150px] transition-transform transform hover:scale-105 z-10">
        <div className="bg-gray-100 p-3 rounded-full mb-2">
          {roleIcons[user.role] || <FaUser className="text-gray-400" />}
        </div>
        <div className="font-bold text-gray-800 text-center">{user.name}</div>
        <div className="text-xs text-gray-500 text-center uppercase tracking-wider font-semibold mt-1">
          {user.role.replace('_', ' ')}
        </div>
        {user.designation && (
          <div className="text-xs text-gray-400 text-center mt-1">{user.designation}</div>
        )}
      </div>

      {childrenNodes && childrenNodes.length > 0 && (
        <>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex justify-center relative">
            {childrenNodes.length > 1 && (
              <div className="absolute top-0 w-[calc(100%-50%)] h-px bg-gray-300" style={{
                left: '25%', right: '25%', width: 'auto' 
              }}></div>
            )}
            <div className="flex gap-6 relative">
              {/* Dynamic top connecting line for siblings */}
              {childrenNodes.length > 1 && (
                <div className="absolute top-0 w-full h-px bg-transparent">
                  <div className="absolute left-[50%] top-0 w-px h-0 bg-gray-300"></div>
                </div>
              )}
              {childrenNodes.map((child, index) => {
                const isFirst = index === 0;
                const isLast = index === childrenNodes.length - 1;
                
                return (
                  <div key={child.user._id} className="flex flex-col items-center relative">
                    {/* Connecting Top line for siblings */}
                    {childrenNodes.length > 1 && (
                      <div className={`absolute top-0 h-px bg-gray-300 ${isFirst ? 'left-[50%] right-0' : isLast ? 'left-0 right-[50%]' : 'left-0 right-0'}`}></div>
                    )}
                    <div className="w-px h-6 bg-gray-300"></div>
                    <OrgNode user={child.user} childrenNodes={child.children} />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const OrganizationChart = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/hr/all-users', { withCredentials: true });
        setUsers(res.data);
      } catch (err) {
        toast.error("Failed to load organization data");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const buildTree = () => {
    const userMap = {};
    users.forEach(u => userMap[u._id] = { user: u, children: [] });

    const tree = [];

    users.forEach(u => {
      if (u.teamLeadId && userMap[u.teamLeadId]) {
        userMap[u.teamLeadId].children.push(userMap[u._id]);
      } else {
        // If no team lead, they are at the top level (Admin, HR, etc.)
        tree.push(userMap[u._id]);
      }
    });

    return tree;
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-semibold animate-pulse">Loading Organization Structure...</div>;
  }

  const tree = buildTree();

  return (
    <div className="bg-gray-50 p-8 rounded-xl shadow-inner overflow-x-auto border border-gray-200">
      <div className="min-w-max flex justify-center">
        {tree.length === 0 ? (
          <div className="text-gray-500">No users found to build chart.</div>
        ) : (
          <div className="flex gap-16 justify-center">
            {tree.map(node => (
              <OrgNode key={node.user._id} user={node.user} childrenNodes={node.children} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationChart;
