cd 'C:\Pruebas';

p = {{parameter1}};

load_system('abs_step');

set_param(gcs,'SimulationCommand','start');
pause(2);

while strcmp(get_param(gcs,'SimulationStatus'),'external')
   %fprintf('Corriendo \n')
   pause(1); 
end

close_system('abs_step');

save('data.mat','VWheel');

exit;