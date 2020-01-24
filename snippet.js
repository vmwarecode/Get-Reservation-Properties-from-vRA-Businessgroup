/* Copyright 2020, VMware, Inc. All Rights 
   VMware vRealize Orchestrator 7.x action sample

   Returns a Array of Properties which contains some parameters from a given vRA Businessgroup 

    Inputs: 
            businessGroup Type:vCACCAFE:Subtenant
            cafeHost Type:vCACCAFE:VCACHost
            iaasHost Type:vCAC:VCACHost
    Output:
            Array/Properties
*/

var res = [];
var clusters = [];
var reservations = vCACCAFEEntitiesFinder.getReservations(cafeHost);
var businessGroupId = businessGroup.id;	
for (var e in reservations) {
	if(reservations[e].getSubTenantId() === businessGroupId) {
		 reservationEntity = System.getModule("com.bechtle.vra.util").getReservationEntityById(iaasHost,reservations[e].id.toString().toUpperCase()) ;	
		if(reservationEntity.getProperty("MachineType") == "0"){
			hasReservations = true;
			p = new Properties();
			p.put("name", reservations[e].name); // Name of the Reservation
			p.put("id", reservations[e].id); // ID of the Reservation
			p.put("reservation", reservations[e]); // The Reservation Object
			p.put("cluster", reservations[e].getExtensionData().get("computeResource").label); // The name of the Cluster for this Reservation
			var allocatedMemoryMB = reservations[e].getExtensionData().asMap().get("reservationMemory").getValue().asMap().get("computeResourceMemoryAllocatedTotalSizeMB").getValue(); // The current allocated Memory of this Reservation
			p.put("allocatedmemorymb", Math.round(allocatedMemoryMB)); // Current allocated Memory in MB of this Reservation
			p.put("allocatedmemorygb", Math.round(p.get("allocatedmemorymb") / 1024)); Current allocated Memory in GB of this Reservation
			if(reservations[e].getReservationPolicyId()){
				p.put("reservationpolicyid", reservations[e].getReservationPolicyId());
				p.put("reservationpolicyname", System.getModule("com.vmware.pso.util").getReservationPolicyNameById(cafeHost, reservations[e].getReservationPolicyId()))
			}else{
				p.put("reservationpolicyid", "");
				p.put("reservationpolicyname", "");
			}
			res.push(p);
		}
	}
}
if(res != null && res.length !=0) return res;
throw ("No Reservation for Business Group: " + businessGroup.name + " found!");

